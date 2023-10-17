import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  Badge,
  Body,
  CalendarIcon,
  ClockIcon,
  MetricGroup,
  MetricVariant,
  Spinner,
  colors,
} from '@walmart/gtp-shared-components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FailureType, MaintenanceType, MontacargasType } from './Survey';
import supabase from '../../supabase/supabase';
import { USER_ID } from '../constants/constants';
import { Machine } from '../store/slices/machinesSlices';

const UserInfo = () => {
  const [userMaintenance, setUserMaintenance] = useState<MaintenanceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [machines, setMachines] = useState<MontacargasType[]>([]);
  const [failureTypes, setFailureTypes] = useState<FailureType[]>([]);
  const [failureDescriptions, setFailureDescriptions] = useState<FailureType[]>(
    [],
  );
  const [totalTime, setTotalTime] = useState(0);
  const [lastMonthTime, setLastMonthTime] = useState(0);

  const getDifference = (start: string, end: string | null) => {
    const startDate = new Date(Number(start));
    const endDate = end ? new Date(Number(end)) : new Date();
    const difference = endDate.getTime() - startDate.getTime();
    // get diferenec in minutes
    return Math.floor(difference / 1000 / 60);
  };

  const getTotalTime = (data: MaintenanceType[]) => {
    data.forEach(maintenance => {
      const date = new Date(Number(maintenance.start));
      const currentMonth = new Date().getMonth();
      const month = date.getMonth();
      const lastMonth = currentMonth - 1;
      if (month === currentMonth) {
        const count = getDifference(maintenance.start, maintenance.end);
        setTotalTime(prev => prev + Number(count));
      }
      if (month === lastMonth) {
        const count = getDifference(maintenance.start, maintenance.end);
        setLastMonthTime(prev => prev + Number(count));
      }
    });
  };

  const getPercentage = () => {
    if (lastMonthTime === 0) {
      return 100;
    }
    const percentage = (totalTime * 100) / lastMonthTime;
    return percentage;
  };

  const totalTimeWorked = [
    {
      title: 'Mantenimientos',
      timescope: new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
      }),
      textLabel: `${getPercentage()}%TM vs LM`,
      value: totalTime,
      unit: 'min.',
      variant: 'positiveUp' as MetricVariant,
    },
    {
      title: 'Maquinas',
      timescope: new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
      }),
      textLabel: `${getPercentage()}%TM vs LM`,
      value: Math.floor(Math.random() * 10),
      unit: 'maq.',
      variant: 'positiveUp' as MetricVariant,
    },
  ];

  const [errorFetch, setError] = useState(false);

  const getMachines = async () => {
    const { data, error } = await supabase.from('montacargas').select('*');
    if (error) {
      console.error(error);
      return setError(true);
    }
    setMachines(data as Machine[]);
    setLoading(false);
  };

  const getFailureTypes = async () => {
    const { data, error } = await supabase.from('failure_type').select('*');
    if (error) {
      console.error(error);
      return setError(true);
    }
    setFailureTypes(data as FailureType[]);
  };

  const getFailureDescriptions = async () => {
    const { data, error } = await supabase.from('failure_desc').select('*');
    if (error) {
      return setError(true);
    }
    setFailureDescriptions(data as FailureType[]);
  };

  const getMaintenance = async () => {
    const { data, error } = await supabase
      .from('maintenance')
      .select('*')
      .match({ user_id: USER_ID });
    if (error) {
      console.error(error);
      return setError(true);
    }
    getTotalTime(data as MaintenanceType[]);
    setUserMaintenance(data as MaintenanceType[]);
    setLoading(false);
  };

  const styledDate = (date: string) => {
    const newDate = new Date(Number(date));
    newDate.setHours(newDate.getHours() - 1);
    return newDate.toLocaleDateString('es-MX', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDate = (date: string) => {
    const newDate = new Date(Number(date));
    newDate.setHours(newDate.getHours() - 1);
    return newDate.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTime = (date: string) => {
    const newDate = new Date(Number(date));
    newDate.setHours(newDate.getHours() - 1);
    return newDate.toLocaleTimeString('es-MX', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  };

  const refetch = async () => {
    setLoading(true);
    await getMaintenance();
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getMaintenance();
    getMachines();
    getFailureTypes();
    getFailureDescriptions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading &&
      !machines &&
      !failureDescriptions &&
      !failureTypes &&
      !userMaintenance ? (
        <Spinner />
      ) : (
        <SafeAreaView style={{ flex: 1, marginTop: -40 }}>
          <MetricGroup
            data={totalTimeWorked}
            allowIndividualTitles
            UNSAFE_style={{ padding: 12 }}
          />
          <FlatList
            data={userMaintenance.sort(
              (a, b) => Number(b.start) - Number(a.start),
            )}
            onRefresh={refetch}
            refreshing={loading}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    padding: 16,
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    backgroundColor: colors.blue['100'],
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      alignItems: 'flex-start',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}>
                      <Body weight="700" UNSAFE_style={{ color: colors.white }}>
                        Fecha
                      </Body>
                      <CalendarIcon size={'small'} color={colors.white} />
                    </View>
                    <Body UNSAFE_style={{ color: colors.white }} weight="700">
                      {getDate(item.start)}
                    </Body>
                  </View>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}>
                      <Body weight="700" UNSAFE_style={{ color: colors.white }}>
                        Tiempo total
                      </Body>
                      <ClockIcon size={'small'} color={colors.white} />
                    </View>
                    <Body weight="700" UNSAFE_style={{ color: colors.white }}>
                      {getDifference(item.start, item.end)} min
                    </Body>
                  </View>
                </View>
                <View
                  style={{
                    paddingHorizontal: 32,
                    paddingBottom: 16,
                    gap: 24,
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Body weight="700">Maquina</Body>
                      <Body>
                        {
                          machines.filter(
                            machine => machine.machine_id === item.machine_id,
                          )[0]?.serial
                        }
                      </Body>
                    </View>
                    <View>
                      <Body weight="700">Tipo de falla</Body>
                      <Body UNSAFE_style={{ textTransform: 'capitalize' }}>
                        {
                          failureTypes.filter(
                            failure => failure.id === item.failure_type_id,
                          )[0]?.description
                        }
                      </Body>
                    </View>
                  </View>
                  <View>
                    <Body weight="700">Descripcion</Body>
                    <Body>
                      {
                        failureDescriptions.filter(
                          failure => failure.id === item.failure_desc_id,
                        )[0]?.description
                      }
                    </Body>
                  </View>
                </View>
                <Badge
                  color={item.end ? 'green' : 'white'}
                  UNSAFE_style={{ position: 'absolute', bottom: 5, right: 5 }}>
                  {item.end ? 'Finalizado' : 'En progreso'}
                </Badge>
              </View>
            )}
          />
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray['5'],
    padding: 16,
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    elevation: 2,
    borderRadius: 10,
    margin: 10,
    gap: 10,
  },
});

export default UserInfo;
