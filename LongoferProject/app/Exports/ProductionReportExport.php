<?php
namespace app\Exports;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Support\Facades\DB;

class ProductionReportExport implements FromCollection, WithHeadings
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = "
            SELECT 
              c.Client,
              o.codeOf,
              a1.ArticleName AS Article_1,
              a2.ArticleName AS Article_2,
              a3.ArticleName AS Article_3,
              a4.ArticleName AS Article_4,
              a5.ArticleName AS Article_5,
              p.date_production,
              p.production_code,

              CASE WHEN EXISTS (
                SELECT 1 FROM emmanchements e WHERE e.ref_Production = p.production_code
              ) THEN 'TRUE' ELSE 'FALSE' END AS emmanchements,

              CASE WHEN EXISTS (
                SELECT 1 FROM manchette_isos m WHERE m.ref_Production = p.production_code
              ) THEN 'TRUE' ELSE 'FALSE' END AS manchette_isos,

              CASE WHEN EXISTS (
                SELECT 1 FROM reparations r WHERE r.ref_Production = p.production_code
              ) THEN 'TRUE' ELSE 'FALSE' END AS reparations,

              CASE WHEN EXISTS (
                SELECT 1 FROM peinture_internes pi WHERE pi.ref_Production = p.production_code
              ) THEN 'TRUE' ELSE 'FALSE' END AS peinture_internes,

              CASE WHEN EXISTS (
                SELECT 1 FROM peinture_externes pe WHERE pe.ref_Production = p.production_code
              ) THEN 'TRUE' ELSE 'FALSE' END AS peinture_externes,

              CASE WHEN EXISTS (
                SELECT 1 FROM sablage_internes si WHERE si.ref_Production = p.production_code
              ) THEN 'TRUE' ELSE 'FALSE' END AS sablage_internes,

              CASE WHEN EXISTS (
                SELECT 1 FROM sablage_externes se WHERE se.ref_Production = p.production_code
              ) THEN 'TRUE' ELSE 'FALSE' END AS sablage_externes

            FROM clients c
            JOIN ofs o ON c.codeClient = o.client
            JOIN productions p ON p.Num_OF = o.codeOf
            LEFT JOIN articles a1 ON a1.codeArticle = o.Article_1
            LEFT JOIN articles a2 ON a2.codeArticle = o.Article_2
            LEFT JOIN articles a3 ON a3.codeArticle = o.Article_3
            LEFT JOIN articles a4 ON a4.codeArticle = o.Article_4
            LEFT JOIN articles a5 ON a5.codeArticle = o.Article_5
        ";

        // ✅ فلترة بالتاريخ أو العميل (اختياري):
        $conditions = [];
        $bindings = [];

        if (!empty($this->filters['client'])) {
            $conditions[] = "c.Client = ?";
            $bindings[] = $this->filters['client'];
        }

        if (!empty($this->filters['from']) && !empty($this->filters['to'])) {
            $conditions[] = "p.date_production BETWEEN ? AND ?";
            $bindings[] = $this->filters['from'];
            $bindings[] = $this->filters['to'];
        }

        if (!empty($conditions)) {
            $query .= " WHERE " . implode(' AND ', $conditions);
        }

        return collect(DB::select($query, $bindings));
    }

    public function headings(): array
    {
        return [
            'Client',
            'Code OF',
            'Article 1',
            'Article 2',
            'Article 3',
            'Article 4',
            'Article 5',
            'Date Production',
            'Production Code',
            'Emmanchements',
            'Manchette Isos',
            'Reparations',
            'Peinture Internes',
            'Peinture Externes',
            'Sablage Internes',
            'Sablage Externes',
        ];
    }
}
