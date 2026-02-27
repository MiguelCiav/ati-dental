import { Search } from 'lucide-react';
import './SearchAndFilter.css';

const SearchAndFilter = ({ searchTerm, onSearchChange, sortOrder, onSortChange }) => {
  return (
    <div className="search-and-filter">
      <div className="search-container">
        <label className="search-label">Buscar Paciente</label>
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Nombre, apellido o ID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="sort-container">
        <label className="sort-label">Ordenar por</label>
        <div className="select-wrapper">
          <select
            className="sort-select"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="recientes">Recientes</option>
            <option value="antiguos">Antiguos</option>
            <option value="nombre-asc">Nombre (A-Z)</option>
            <option value="nombre-desc">Nombre (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;

