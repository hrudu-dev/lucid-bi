interface DataTableProps {
  data: any[]
  columns: string[]
}

export function DataTable({ data, columns }: DataTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data available
      </div>
    )
  }

  return (
    <div className="overflow-auto max-h-96">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr>
            {columns.map((column) => (
              <th key={column} className="text-left p-2 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 100).map((row, index) => (
            <tr key={index} className="border-b hover:bg-muted/50">
              {columns.map((column) => (
                <td key={column} className="p-2">
                  {typeof row[column] === 'object' 
                    ? JSON.stringify(row[column], null, 2).slice(0, 100) + '...'
                    : String(row[column] || '')
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}