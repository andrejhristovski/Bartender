import { Link } from 'react-router-dom'
import Image from './Image'
import { GlassIcon } from '../lib/glasses.jsx'

// A real anchor, not a button: crawlers need an href to discover recipe URLs,
// and it gives middle-click / open-in-new-tab for free.
export default function DrinkCard({ recipe, number }) {
  return (
    <Link className="drink" to={`/recipes/${recipe.slug}`}>
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
    </Link>
  )
}
