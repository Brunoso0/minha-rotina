import { CheckSquare } from 'lucide-react'

function PerformanceCard({ completed, total }) {
  const percent = total ? Math.round((completed / total) * 100) : 0

  return (
    <section className="planner-performance-card">
      <h3>Desempenho</h3>
      <div className="planner-performance-row">
        <div>
          <p className="planner-performance-total">{completed}</p>
          <p className="planner-performance-label">TOTAL FEITO</p>
          <p className="planner-performance-label">{percent}% do total</p>
        </div>
        <CheckSquare size={40} />
      </div>
    </section>
  )
}

export default PerformanceCard
