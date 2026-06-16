import { Link } from 'react-router-dom';
import '../styles/home.css';

const CategoryCard = ({ category, image }) => {
  const categoryImages = {
    Fashion: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=60',
    Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&auto=format&fit=crop&q=60',
    Mobiles: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=60',
    Groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=60',
    'Sports-Equipment': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&auto=format&fit=crop&q=60',
  };

  const displayCategory = category.replace('-', ' ');

  return (
    <Link to={`/products?category=${category}`} className="category-card">
      <div className="category-image">
        <img 
          src={image || categoryImages[category] || categoryImages.Electronics} 
          alt={displayCategory} 
        />
      </div>
      <h3 className="category-name">{displayCategory}</h3>
    </Link>
  );
};

export default CategoryCard;
