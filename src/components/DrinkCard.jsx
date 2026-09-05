import Image from './Image'
import { GlassIcon } from '../lib/glasses.jsx'

export default function DrinkCard({ recipe, number, onOpen }) {
  return (
    <button type="button" className="drink reveal" onClick={onOpen}>
      <div className="drink__frame">
        <div className="drink__wash" aria-hidden="true" />
        {recipe.image ? (
          <Image className="drink__photo" src={recipe.image} alt={recipe.title} />
        ) : (
          <GlassIcon glass={recipe.glass} className="drink__icon" />
        )}
        <span className="drink__no">{number}</span>
        <div className="drink__pour" aria-hidden="true" />
      </div>
      <h3 className="drink__name">{recipe.title}</h3>
      {recipe.description && <p className="drink__short">{recipe.description}</p>}
    </button>
  )
}
