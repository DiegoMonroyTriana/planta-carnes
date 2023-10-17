import {
  Select,
  colors,
  CalendarIcon,
  Heading,
} from '@walmart/gtp-shared-components/dist';
import React, { useState } from 'react';
import { View } from 'react-native';
import { BarChart as Chart, LineChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';

const BarChart = ({ currentMachine }: { currentMachine: string }) => {
  const bandaData = Array.from(Array(10).keys()).map(time => {
    return {
      value: Math.floor(Math.random() * 10) + 85,
      label: `${time + 1}`,
    };
  });

  const options = [
    {
      text: 'Mes',
      value: 'month',
    },
    {
      text: 'Semana Walmart',
      value: 'week',
    },
    {
      text: 'Año',
      value: 'year',
    },
  ];

  const month = [
    {
      text: 'Enero',
      value: 'january',
    },
    {
      text: 'Febrero',
      value: 'february',
    },
    {
      text: 'Marzo',
      value: 'march',
    },
    {
      text: 'Abril',
      value: 'april',
    },
    {
      text: 'Mayo',
      value: 'may',
    },
    {
      text: 'Junio',
      value: 'june',
    },
    {
      text: 'Julio',
      value: 'july',
    },
    {
      text: 'Agosto',
      value: 'august',
    },
    {
      text: 'Septiembre',
      value: 'september',
    },
    {
      text: 'Octubre',
      value: 'october',
    },
    {
      text: 'Noviembre',
      value: 'november',
    },
    {
      text: 'Diciembre',
      value: 'december',
    },
  ];

  const week = Array.from(Array(53).keys()).map(week => {
    return {
      text: `Semana ${week + 1}`,
      value: week + 1,
    };
  });
  const year = Array.from(Array(10).keys()).map(year => {
    return {
      text: `${year + 2020}`,
      value: year + 2020,
    };
  });

  const [dateSelected, setDateSelected] = useState(options[0].text);
  const [currentSearch, setCurrentSearch] = useState(month);

  function changePeriod(value: string) {
    setDateSelected(value);
    if (value === 'Mes') {
      setCurrentSearch(month);
    }
    if (value === 'Semana Walmart') {
      setCurrentSearch(week);
    }
    if (value === 'Año') {
      setCurrentSearch(year);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white, gap: 10 }}>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <View style={{ flex: 0.5 }}>
          <Select
            label="Periodo"
            size="small"
            placeholder="Selecciona un periodo"
            leading={<CalendarIcon />}
            selectOptions={options.map(option => {
              return {
                text: option.text,
                selected: option.text === dateSelected,
              };
            })}
            onChange={value => {
              changePeriod(value[0].text);
            }}
          />
        </View>
        <View style={{ flex: 0.5 }}>
          <Select
            size="small"
            label={dateSelected}
            placeholder=""
            leading={<CalendarIcon />}
            selectOptions={currentSearch.map(option => {
              return {
                text: option.text,
              };
            })}
            onChange={value => {
              console.log(value);
            }}
          />
        </View>
      </View>
      <LineChart
        noOfSections={2}
        data={bandaData}
        yAxisThickness={0}
        xAxisThickness={0}
        isAnimated
        thickness={3}
        color={colors.blue['100']}
        animateOnDataChange
        animationDuration={1000}
        onDataChangeAnimationDuration={300}
        areaChart
        hideDataPoints
        startFillColor={colors.blue['100']}
        endFillColor={colors.blue['10']}
        startOpacity={1}
        endOpacity={0.5}
        initialSpacing={10}
      />
    </SafeAreaView>
  );
};

export default BarChart;
