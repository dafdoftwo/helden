'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/i18n';
import { FiX } from 'react-icons/fi';
import ReactSlider from 'react-slider';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedSizes: string[];
  setSelectedSizes: (sizes: string[]) => void;
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  className?: string;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#008000' },
  { name: 'Purple', value: '#800080' },
  { name: 'Gold', value: '#FFD700' },
  { name: 'Pink', value: '#FFC0CB' },
  { name: 'Beige', value: '#F5F5DC' },
  { name: 'Brown', value: '#A52A2A' },
  { name: 'Gray', value: '#808080' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  priceRange,
  setPriceRange,
  selectedSizes,
  setSelectedSizes,
  selectedColors,
  setSelectedColors,
  className = '',
}) => {
  const { t } = useTranslation();
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handlePriceChange = (newValues: number[]) => {
    setLocalPriceRange(newValues);
  };

  const applyPriceRange = () => {
    setPriceRange(localPriceRange);
  };

  const resetFilters = () => {
    setPriceRange([0, 2000]);
    setLocalPriceRange([0, 2000]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  return (
    <div className={`${className} bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen' : ''}`}>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">{t('filters.title')}</h2>
        <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
          <FiX size={24} />
        </button>
      </div>

      <div className="p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-md font-medium mb-4">{t('filters.price')}</h3>
          <ReactSlider
            className="h-4 w-full bg-gray-200 rounded-md mt-6"
            thumbClassName="h-5 w-5 bg-helden-purple-DEFAULT text-white rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-helden-purple-light focus:ring-opacity-50 transform -translate-x-2.5 -translate-y-1.5 z-10"
            trackClassName="h-2 bg-helden-purple-light rounded-md"
            min={0}
            max={2000}
            value={localPriceRange}
            onChange={handlePriceChange}
            onAfterChange={applyPriceRange}
            ariaLabel={['Lower price', 'Upper price']}
            renderThumb={(props) => <div {...props} />}
            pearling
            minDistance={50}
          />
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">
              {localPriceRange[0]} {t('common.sar')}
            </span>
            <span className="text-sm text-gray-600">
              {localPriceRange[1]} {t('common.sar')}
            </span>
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <h3 className="text-md font-medium mb-4">{t('filters.size')}</h3>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors duration-200
                  ${selectedSizes.includes(size)
                    ? 'bg-helden-purple-DEFAULT text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-helden-purple-light'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="mb-6">
          <h3 className="text-md font-medium mb-4">{t('filters.color')}</h3>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => toggleColor(color.value)}
                className={`w-8 h-8 rounded-full border ${selectedColors.includes(color.value) ? 'ring-2 ring-helden-purple-DEFAULT' : 'ring-1 ring-gray-300'}`}
                style={{ backgroundColor: color.value }}
                title={color.name}
                aria-label={color.name}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 mt-4">
          <button
            onClick={resetFilters}
            className="w-full btn-outline-primary"
          >
            {t('filters.clearAll')}
          </button>
        </div>
      </div>
    </div>
  );
}; 