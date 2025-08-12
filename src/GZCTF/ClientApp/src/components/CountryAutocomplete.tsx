import { Combobox, Group, Image, Input, InputBase, useCombobox, Text } from '@mantine/core'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import countries from '../utils/countries.json'

interface CountryData {
  flag: string
  country: string
  code?: string
}

interface CountryAutocompleteProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  w?: string | number
}

const countryData = countries as CountryData[]

const getCountryByName = (name: string): CountryData | undefined => {
  return countryData.find(c => c.country.toLowerCase() === name.toLowerCase())
}

const renderFlag = (flagUrl: string, code?: string) => (
  <Image
    src={flagUrl}
    alt={`${code || 'country'} flag`}
    width={16}
    height={12}
    style={{ maxWidth: 16, objectFit: 'cover', borderRadius: 2 }}
    onError={(e) => {
      // Fallback to country code if image fails to load
      const target = e.currentTarget as HTMLImageElement
      target.style.display = 'none'
      if (code && target.parentElement) {
        const fallback = document.createElement('span')
        fallback.textContent = code.toUpperCase()
        fallback.style.fontSize = '10px'
        fallback.style.fontWeight = 'bold'
        fallback.style.color = '#666'
        fallback.style.minWidth = '16px'
        fallback.style.textAlign = 'center'
        target.parentElement.insertBefore(fallback, target)
      }
    }}
  />
)

export const CountryAutocomplete: FC<CountryAutocompleteProps> = ({
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  maxLength = 72,
  w = '100%'
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  const [search, setSearch] = useState('')
  const { t } = useTranslation()

  const filteredOptions = countryData.filter((item) =>
    item.country.toLowerCase().includes(search.toLowerCase().trim()) ||
    (item.code && item.code.toLowerCase().includes(search.toLowerCase().trim()))
  )

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item.country} key={item.country}>
      <Group gap={8} wrap="nowrap">
        {renderFlag(item.flag, item.code)}
        <Text size="sm" style={{ flex: 1 }}>{item.country}</Text>
      </Group>
    </Combobox.Option>
  ))

  const selectedCountry = value ? getCountryByName(value) : null

  return (
    <Combobox
      store={combobox}
      withinPortal={true}
      position="bottom-start"
      middlewares={{ flip: true, shift: true }}
      onOptionSubmit={(val) => {
        onChange?.(val)
        setSearch('')
        combobox.closeDropdown()
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          disabled={disabled}
          label={label}
          w={w}
        >
          {value ? (
            <Group gap={8} wrap="nowrap">
              {selectedCountry && renderFlag(selectedCountry.flag, selectedCountry.code)}
              <Text size="sm" truncate style={{ flex: 1 }}>{value}</Text>
            </Group>
          ) : (
            <Input.Placeholder>{placeholder}</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder={t('team.placeholder.country_search', 'Search countries...')}
        />
        <Combobox.Options mah={200} style={{ overflowY: 'auto' }}>
          {options.length > 0 ? options : <Combobox.Empty>{t('team.content.no_countries', 'No countries found')}</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}