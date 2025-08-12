import { Group, Image, Text } from '@mantine/core'
import countries from './countries.json'

interface CountryData {
  flag: string
  country: string
  code?: string
}

const countryData = countries as CountryData[]

export const getCountryByName = (name: string): CountryData | undefined => {
  return countryData.find(c => c.country.toLowerCase() === name.toLowerCase())
}

export const renderCountryFlag = (country: string | null | undefined) => {
  if (!country) return null
  
  const countryInfo = getCountryByName(country)
  
  if (!countryInfo) {
    // For backward compatibility - show country name if not in list
    return (
      <Text size="xs" c="dimmed" span>
        {country}
      </Text>
    )
  }

  return (
    <Group gap={4} wrap="nowrap">
      <Image
        src={countryInfo.flag}
        alt={`${countryInfo.code || 'country'} flag`}
        width={16}
        height={12}
        style={{ minWidth: 16, objectFit: 'cover' }}
        onError={(e) => {
          // Fallback to text if image fails to load
          const target = e.currentTarget
          target.style.display = 'none'
          const textElement = target.nextSibling as HTMLElement
          if (textElement && countryInfo.code) {
            textElement.textContent = countryInfo.code.toUpperCase()
            textElement.style.display = 'inline'
          }
        }}
      />
      <Text size="xs" c="dimmed" span style={{ display: 'none' }}>
        {countryInfo.code?.toUpperCase() || ''}
      </Text>
    </Group>
  )
}

export const getCountryDisplayName = (country: string | null | undefined): string => {
  if (!country) return ''
  
  const countryInfo = getCountryByName(country)
  
  if (!countryInfo) {
    // For backward compatibility - return original name if not in list
    return country
  }

  return countryInfo.code ? `${countryInfo.code.toUpperCase()} ${countryInfo.country}` : countryInfo.country
}

export const shouldShowCountryIcon = (country: string | null | undefined): boolean => {
  if (!country) return false
  return !!getCountryByName(country)
}