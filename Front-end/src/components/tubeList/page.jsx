import { columns } from "./columns"
import { DataTable } from "./data-table"

export default function DemoPage() {
  const data = [{
    NumOF: 'cd001',
    Article: 'tb675',
    RefArticle: 'dey5',
    QteProduite: '20',
    DateProduction: new Date().toLocaleDateString(),
    Machine: 'machine 342',
    Statut: 'conforme',
    Défaut: 'not exist',
    Causse: 'not exist',
    Operateur: 'ahmed',
    Soudeur: 'brahim',
    Controleur: 'hicjam',
  }]

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}