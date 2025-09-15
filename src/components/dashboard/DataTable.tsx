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
    <div className="w-full">
      {/* Mobile card view */}
      <div className="block sm:hidden space-y-4">
        {data.slice(0, 20).map((row, index) => (
          <div key={index} className="bg-card border rounded-lg p-4 space-y-2">
            {columns.slice(0, 3).map((column) => (
              <div key={column} className="flex justify-between items-start">
                <span className="font-medium text-sm text-muted-foreground">
                  {column}:
                </span>
                <span className="text-sm text-right max-w-[60%] break-words">
                  {typeof row[column] === 'object' 
                    ? JSON.stringify(row[column], null, 2).slice(0, 50) + '...'
                    : String(row[column] || '')
                  }
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden sm:block overflow-x-auto">
        <div className="overflow-y-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="border-b sticky top-0 bg-background">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="text-left p-3 font-medium whitespace-nowrap">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 100).map((row, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  {columns.map((column) => (
                    <td key={column} className="p-3 max-w-xs">
                      <div className="truncate">
                        {typeof row[column] === 'object' 
                          ? JSON.stringify(row[column], null, 2).slice(0, 100) + '...'
                          : String(row[column] || '')
                        }
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}