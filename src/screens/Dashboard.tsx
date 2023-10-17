import {
  Body,
  Heading,
  Metric,
  MetricGroup,
  MetricVariant,
} from '@walmart/gtp-shared-components/dist';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import supabase from '../../supabase/supabase';
import { MaintenanceType, MontacargasType } from './Survey';
import BarChart from '../components/BarChart';

function Dashboard() {
  const options = [
    {
      current: 'Hoy',
      last: 'Ayer',
    },
    {
      current: 'Semana',
      last: 'Semana pasada',
    },
    {
      current: 'Mes',
      last: 'Mes pasado',
    },
  ];
  const date = new Date();
  const dateFormatted = new Intl.DateTimeFormat('es-MX', {
    month: 'long',
    day: 'numeric',
  }).format(date);

  const [sort, setSort] = useState(options[0]);
  const [totalMontacargas, setTotalMontacargas] = useState([]);
  const [totalMontacargasSecos, setTotalMontacargasSecos] = useState([]);
  const [totalMontacargasRefrigerados, setTotalMontacargasRefrigerados] =
    useState([]);
  const [percentageSecos, setPercentageSecos] = useState(0);
  const [percentageRefrigerados, setPercentageRefrigerados] = useState(0);

  const individualMetricData = [
    {
      title: 'Secos',
      timescope: `Total: ${totalMontacargasSecos.length} \nEn mantenimiento: ${percentageSecos}`,
      textLabel: `5.5% vs ${sort.last}`,
      value: `${
        100 -
        Math.floor(
          ((percentageSecos * 100) / totalMontacargasSecos.length) * 100,
        ) /
          100
      }`,
      unit: '%',
      variant: 'negativeUp' as MetricVariant,
    },
    {
      title: 'Perecederos',
      timescope: `Total: ${totalMontacargasRefrigerados.length} \nEn mantenimiento: ${percentageRefrigerados}`,
      textLabel: `1.2% vs ${sort.last}`,
      value: `${
        100 -
        Math.floor(
          ((percentageRefrigerados * 100) /
            totalMontacargasRefrigerados.length) *
            100,
        ) /
          100
      }`,
      unit: '%',
      variant: 'negativeDown' as MetricVariant,
    },
  ];

  async function getMaintenance(data1, data2) {
    const { data } = await supabase.from('maintenance').select('*');
    data?.forEach((maintenance: MaintenanceType) => {
      const isSecos = data1.filter(
        (montacarga: MontacargasType) =>
          !maintenance.end && montacarga.machine_id === maintenance.machine_id,
      );
      const isRefrigerados = data2.filter(
        (montacarga: MontacargasType) =>
          !maintenance.end && montacarga.machine_id === maintenance.machine_id,
      );
      if (isSecos.length > 0) {
        setPercentageSecos(prev => prev + 1);
      }
      if (isRefrigerados.length > 0) {
        setPercentageRefrigerados(prev => prev + 1);
      }
    });
  }

  useEffect(() => {
    async function getMontacargas() {
      const { data } = await supabase
        .from('montacargas')
        .select('*')
        .eq('zone', 'SECOS');
      setTotalMontacargasSecos(data);
      const { data: data2 } = await supabase
        .from('montacargas')
        .select('*')
        .eq('zone', 'PERECEDEROS');
      setTotalMontacargasRefrigerados(data2);
      getMaintenance(data, data2);
    }
    getMontacargas();
  }, []);

  return (
    <SafeAreaView
      style={{
        padding: 16,
        flex: 1,
        backgroundColor: 'white',
        gap: 5,
        flexDirection: 'column',
      }}>
      <Body weight="900">Region Cuautitlán</Body>
      <Heading>Disponibilidad de montacargas</Heading>
      <MetricGroup
        data={individualMetricData}
        allowIndividualTitles
        UNSAFE_style={{ gap: 12 }}
      />
      <BarChart currentMachine="Montacargas" />
    </SafeAreaView>
  );
}
export default Dashboard;
