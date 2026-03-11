import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import './SearchAndFilter.css';

const SearchAndFilter = ({ searchTerm, onSearchChange, sortOrder, onSortChange }) => {
  const { t } = useTranslation('common');

  return (
    <div className="search-and-filter">
      <div className="search-container">
        <label className="search-label">{t('patientList.searchLabel')}</label>
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder={t('patientList.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="sort-container">
        <label className="sort-label">{t('patientList.sortLabel')}</label>
        <div className="select-wrapper">
          <select
            className="sort-select"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="recientes">{t('patientList.sortRecent')}</option>
            <option value="antiguos">{t('patientList.sortOldest')}</option>
            <option value="nombre-asc">{t('patientList.sortNameAZ')}</option>
            <option value="nombre-desc">{t('patientList.sortNameZA')}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
