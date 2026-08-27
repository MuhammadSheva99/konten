import { mockDraftStock } from "@/lib/mockData";
 
const LOW_STOCK_THRESHOLD = 5;
 
export default function DraftStockPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Monitoring Draft Konten</h1>
        <p className="text-muted text-sm mt-1">Stok draft konten mingguan per brand. Angka merah = stok menipis, perlu diisi ulang.</p>
      </div>
 
      <div className="card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Brand</th>
              <th>PIC</th>
              {mockDraftStock[0]?.weeks.map((w) => (
                <th key={w.label} className="text-center">{w.label}</th>
              ))}
              <th>Link Draft</th>
            </tr>
          </thead>
          <tbody>
            {mockDraftStock.map((row) => (
              <tr key={row.brand}>
                <td className="text-white">{row.brand}</td>
                <td>{row.pic}</td>
                {row.weeks.map((w) => (
                  <td key={w.label} className="text-center">
                    <span
                      className={`badge ${
                        w.count === 0
                          ? "bg-bad/15 text-bad"
                          : w.count < LOW_STOCK_THRESHOLD
                          ? "bg-warn/15 text-warn"
                          : "bg-good/15 text-good"
                      }`}
                    >
                      {w.count}
                    </span>
                  </td>
                ))}
                <td>
                  <a href={row.linkDraft} target="_blank" className="text-accent hover:underline text-sm">
                    Buka folder
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <div className="card text-sm text-muted">
        Warna: <span className="text-good">hijau</span> = stok aman (≥{LOW_STOCK_THRESHOLD}), <span className="text-warn">kuning</span> = mulai menipis, <span className="text-bad">merah</span> = habis (0).
      </div>
    </div>
  );
}