import React, { useState, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';

export interface Option {
  label: string;
  value: string;
  subtitle?: string;
}

interface OptionSelectorProps {
  label: string;
  options: Option[];
  selectedValue?: string;
  onSelect: (option: Option) => void;
  onAddNew?: () => void;
  placeholder?: string;
  error?: string;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  onAddNew,
  placeholder = "Seleccionar...",
  error
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Nuevo estado de control
  const [search, setSearch] = useState('');
  const inputRef = useRef<TextInput>(null);

  const selectedOption = useMemo(() => 
    options.find(o => o.value === selectedValue), 
    [options, selectedValue]
  );

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const lowerSearch = search.toLowerCase();
    return options.filter(o => 
      o.label.toLowerCase().includes(lowerSearch) || 
      (o.subtitle && o.subtitle.toLowerCase().includes(lowerSearch))
    );
  }, [search, options]);

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };

  const handleSelect = (item: Option) => {
    onSelect(item);
    setIsOpen(false);
    setIsSearching(false);
    setSearch('');
  };

  const toggleSearch = () => {
    if (isSearching) {
      setIsSearching(false);
      setSearch('');
    } else {
      setIsSearching(true);
      // Damos un pequeño respiro para que el componente se renderice antes de enfocar
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <View className="w-full mb-4">
      <Text className="text-text-primary dark:text-text-inverse font-bold mb-2 text-sm ml-1 font-sans">
        {label}
      </Text>

      <View 
        className={`
          bg-surface-light dark:bg-surface-dark 
          border rounded-xl overflow-hidden transition-all
          ${error ? 'border-status-danger' : (isOpen ? 'border-primary' : 'border-border-light dark:border-border-dark')}
        `}
      >
        <View className="flex-row items-center h-14 px-3">
          {/* Botón de Lupa: Ahora es interactivo para activar búsqueda */}
          <TouchableOpacity onPress={toggleSearch} className="p-2">
            <Feather 
              name={isSearching ? "x" : "search"} 
              size={20} 
              color={isSearching ? "#ef4444" : "#94a3b8"} 
            />
          </TouchableOpacity>

          {isSearching ? (
            /* Input de Búsqueda */
            <TextInput
              ref={inputRef}
              className="flex-1 ml-2 font-medium text-base text-text-primary dark:text-text-inverse h-full"
              placeholder={t('common.search', 'Buscar...')}
              placeholderTextColor="#94a3b8"
              value={search}
              onChangeText={setSearch}
            />
          ) : (
            /* Display del Valor */
            <TouchableOpacity 
              className="flex-1 ml-2 h-full justify-center"
              onPress={() => {
                setIsOpen(!isOpen);
                setIsSearching(false); // Resetear búsqueda al cerrar/abrir menú
              }}
              activeOpacity={0.7}
            >
              <Text 
                numberOfLines={1}
                className={`font-medium text-base ${selectedOption ? 'text-text-primary dark:text-text-inverse' : 'text-text-secondary'}`}
              >
                {selectedOption?.label || placeholder}
              </Text>
            </TouchableOpacity>
          )}

          {/* Flecha Toggle */}
          <TouchableOpacity 
            onPress={() => setIsOpen(!isOpen)} 
            className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg ml-2"
          >
            <Feather name={isOpen ? "chevron-up" : "chevron-down"} size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        {isOpen && (
          <View className="border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
            <ScrollView 
              className="max-h-60" 
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((item) => {
                  const isSelected = selectedValue === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      onPress={() => handleSelect(item)}
                      className={`flex-row items-center p-3 border-b border-gray-50 dark:border-white/5 ${isSelected ? 'bg-primary/5' : ''}`}
                    >
                      <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isSelected ? 'bg-primary' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        <Text className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-300'}`}>
                          {getInitials(item.label)}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className={`font-medium text-base ${isSelected ? 'text-primary' : 'text-text-primary dark:text-text-inverse'}`}>
                          {item.label}
                        </Text>
                        {item.subtitle && <Text className="text-xs text-text-secondary mt-0.5">{item.subtitle}</Text>}
                      </View>
                      {isSelected && <Feather name="check" size={18} color="#13c8ec" />}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View className="p-4 items-center">
                  <Text className="text-text-secondary text-sm italic">{t('common.noResults', 'No hay resultados')}</Text>
                </View>
              )}
              {onAddNew && (
                <TouchableOpacity onPress={onAddNew} className="flex-row items-center justify-center py-4 bg-gray-50/50 dark:bg-surface-darker mt-2">
                  <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-2">
                    <Feather name="plus" size={16} color="#13c8ec" />
                  </View>
                  <Text className="text-primary font-bold font-sans">{t('patient.addNew', 'Crear Nuevo Paciente')}</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}
      </View>
      {error && <Text className="text-status-danger text-xs mt-1 ml-1 font-medium">{error}</Text>}
    </View>
  );
};