import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Body,
  Caption,
  GridFillIcon,
  GridIcon,
  Heading,
  HomeIcon,
  IconButton,
  MenuIcon,
  MetricGroup,
  MetricVariant,
  NoteIcon,
  Select,
  UserIcon,
  WrenchIcon,
  colors,
} from '@walmart/gtp-shared-components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import supabase from '../../supabase/supabase';
import Auth from '../screens/Auth';
import Dashboard from '../screens/Dashboard';
import Survey from '../screens/Survey';
import UserInfo from '../screens/UserInfo';
import BarChart from '../components/BarChart';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  const options = [
    {
      text: 'Bandas',
      value: 'banda',
    },
    {
      text: 'Sierras',
      value: 'sierra',
    },
    {
      text: 'Esterilizador',
      value: 'esterilizador',
    },
  ];
  const [currentMachine, setCurrentMachine] = useState(options[0].text);
  const individualMetricData = [
    {
      title: `Fallo de ${currentMachine.toLowerCase()}`,
      timescope: '1 min ago',
      textLabel: '5.5%TY vs LY',
      value: `${Math.floor(Math.random() * 100)}`,
      unit: 'min',
      variant: 'negativeUp' as MetricVariant,
    },
    {
      title: 'Inactividad',
      timescope: '1 min ago',
      textLabel: '1.2%TW vs LW',
      value: `${Math.floor(Math.random() * 100)}`,
      unit: 'min',
      variant: 'negativeDown' as MetricVariant,
    },
  ];

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={{ flex: 1, backgroundColor: colors.white, padding: 16 }}>
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View style={{ flex: 0.5 }}>
            <Select
              label="Selecciona una máquina"
              placeholder="Selecciona una máquina"
              size="medium"
              selectOptions={options.map(option => {
                return {
                  text: option.text,
                  selected: option.text === currentMachine,
                };
              })}
              onChange={value => {
                setCurrentMachine(value[0].text);
              }}
            />
          </View>
        </View>
        <MetricGroup
          data={individualMetricData}
          allowIndividualTitles
          UNSAFE_style={{ padding: 12 }}
        />
        <BarChart currentMachine={currentMachine} />
      </View>
    </View>
  );
}

type IconName = 'home' | 'survey' | 'dashboard' | 'userinfo';

const RootNavigation = () => {
  const names = {
    home: 'Inicio',
    survey: 'Registro',
    dashboard: 'Reporte',
    userinfo: 'Trabajos',
  };

  const icons = (name: IconName, color: any) => {
    const iconMap = {
      home: <HomeIcon size={'medium'} color={color} />,
      survey: <NoteIcon size={'medium'} color={color} />,
      dashboard: <GridIcon size={'medium'} color={color} />,
      userinfo: <WrenchIcon size={'medium'} color={color} />,
    };
    return iconMap[name];
  };

  const getOptions = (name: IconName) => ({
    tabBarIcon(props: any) {
      const color = props.focused ? colors.blue['100'] : colors.black;
      return icons(name, color);
    },
    tabBarBadge: name === 'home' ? 3 : undefined,
    tabBarAllowFontScaling: true,
    headerStyle: {
      backgroundColor: colors.blue['100'],
    },
    headerTitle: () => (
      <Heading UNSAFE_style={{ color: colors.white }}>{names[name]}</Heading>
    ),
    headerLeft: () => (
      <IconButton onPress={() => {}} size="medium">
        <MenuIcon color={colors.white} />
      </IconButton>
    ),
    tabBarLabel(props: any) {
      return (
        <Body
          size="small"
          UNSAFE_style={{
            color: props.focused ? colors.blue['100'] : colors.black,
            fontWeight: props.focused ? 'bold' : 'normal',
          }}>
          {names[name]}
        </Body>
      );
    },
  });

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen
          name={names.home}
          options={getOptions('home')}
          component={Dashboard}
        />
        <Tab.Screen
          name={names.survey}
          component={Survey}
          options={getOptions('survey')}
        />
        <Tab.Screen
          name={names.userinfo}
          component={UserInfo}
          options={getOptions('userinfo')}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
