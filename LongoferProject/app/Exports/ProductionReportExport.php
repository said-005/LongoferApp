<?php
namespace app\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Illuminate\Support\Facades\DB;

class ProductionReportExport implements FromCollection, WithHeadings, WithColumnWidths
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

              -- Emmanchement
              (SELECT e.date_Emmanchement FROM emmanchements e WHERE e.ref_production = p.production_code LIMIT 1) AS emmanchement_date,
              (SELECT e.code_Emmanchement FROM emmanchements e WHERE e.ref_production = p.production_code LIMIT 1) AS emmanchement_code,

              -- Manchette ISO
              (SELECT m.date_Manchette FROM manchette_isos m WHERE m.ref_production = p.production_code LIMIT 1) AS manchette_date,
              (SELECT m.code_Manchette FROM manchette_isos m WHERE m.ref_production = p.production_code LIMIT 1) AS manchette_code,

              -- Reparation
              (SELECT r.date_reparation FROM reparations r WHERE r.ref_production = p.production_code LIMIT 1) AS reparation_date,
              (SELECT r.code_Reparation FROM reparations r WHERE r.ref_production = p.production_code LIMIT 1) AS reparation_code,

              -- Peinture Interne
              (SELECT pi.date_Peinture_Interne FROM peinture_internes pi WHERE pi.ref_production = p.production_code LIMIT 1) AS peinture_interne_date,
              (SELECT pi.code_Peinture_Internes FROM peinture_internes pi WHERE pi.ref_production = p.production_code LIMIT 1) AS peinture_interne_code,

              -- Peinture Externe
              (SELECT pe.date_Peinture_Externe FROM peinture_externes pe WHERE pe.ref_production = p.production_code LIMIT 1) AS peinture_externe_date,
              (SELECT pe.code_Peinture_Externe FROM peinture_externes pe WHERE pe.ref_production = p.production_code LIMIT 1) AS peinture_externe_code,

              -- Sablage Interne
              (SELECT si.date_Sablage_Interne FROM sablage_internes si WHERE si.ref_production = p.production_code LIMIT 1) AS sablage_interne_date,
              (SELECT si.code_Sablage_Interne FROM sablage_internes si WHERE si.ref_production = p.production_code LIMIT 1) AS sablage_interne_code,

              -- Sablage Externe
              (SELECT se.date_Sablage_Externe FROM sablage_externes se WHERE se.ref_production = p.production_code LIMIT 1) AS sablage_externe_date,
              (SELECT se.code_Sablage_Externe FROM sablage_externes se WHERE se.ref_production = p.production_code LIMIT 1) AS sablage_externe_code

            FROM clients c
            JOIN ofs o ON c.codeClient = o.client
            JOIN productions p ON p.Num_OF = o.codeOf
            LEFT JOIN articles a1 ON a1.codeArticle = o.Article_1
            LEFT JOIN articles a2 ON a2.codeArticle = o.Article_2
            LEFT JOIN articles a3 ON a3.codeArticle = o.Article_3
            LEFT JOIN articles a4 ON a4.codeArticle = o.Article_4
            LEFT JOIN articles a5 ON a5.codeArticle = o.Article_5
        "; // Removed the semicolon here

        // Filtering
        $conditions = [];
        $bindings = [];

        if (!empty($this->filters['client'])) {
            $conditions[] = "c.codeClient = ?";
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
            'OF',
            'Article 1',
            'Article 2',
            'Article 3',
            'Article 4',
            'Article 5',
            'Date Production',
            'Reference Production',
            
            // Emmanchement
            'Emmanchement Date',
            'Emmanchement Code',
            
            // Manchette ISO
            'Manchette ISO Date',
            'Manchette ISO Code',
            
            // Reparation
            'Reparation Date',
            'Reparation Code',
            
            // Peinture Interne
            'Peinture Interne Date',
            'Peinture Interne Code',
            
            // Peinture Externe
            'Peinture Externe Date',
            'Peinture Externe Code',
            
            // Sablage Interne
            'Sablage Interne Date',
            'Sablage Interne Code',
            
            // Sablage Externe
            'Sablage Externe Date',
            'Sablage Externe Code',
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 20,  // Client
            'B' => 15,  // OF
            'C' => 25,  // Article 1
            'D' => 25,  // Article 2
            'E' => 25,  // Article 3
            'F' => 25,  // Article 4
            'G' => 25,  // Article 5
            'H' => 20,  // Date Production
            'I' => 25,  // Reference Production
            
            // Date columns
            'J' => 20,  // Emmanchement Date
            'L' => 20,  // Manchette ISO Date
            'N' => 20,  // Reparation Date
            'P' => 20,  // Peinture Interne Date
            'R' => 20,  // Peinture Externe Date
            'T' => 20,  // Sablage Interne Date
            'V' => 20,  // Sablage Externe Date
            
            // Code columns
            'K' => 25,  // Emmanchement Code
            'M' => 25,  // Manchette ISO Code
            'O' => 25,  // Reparation Code
            'Q' => 25,  // Peinture Interne Code
            'S' => 25,  // Peinture Externe Code
            'U' => 25,  // Sablage Interne Code
            'W' => 25,  // Sablage Externe Code
        ];
    }
}