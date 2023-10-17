import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import {
  Button,
  Spinner,
  Heading,
  Select,
  TextArea,
  colors,
  Body,
  TextField,
  Caption,
} from '@walmart/gtp-shared-components';
import supabase from '../../supabase/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { USER_ID } from '../constants/constants';

export interface Machine {
  id: string;
  name: string;
}

export interface FailureType {
  id: string;
  description: string;
}

export interface MaintenanceType {
  id: number;
  machine_id: string;
  failure_type_id: string;
  failure_desc_id: string;
  comments: string;
  user_id: string;
  start: string;
  end: string | null;
}

export interface MontacargasType {
  brand: string;
  det: number;
  id: string;
  machine_id: string;
  is_inactive: boolean;
  model: string;
  region: string;
  serial: string;
  time_inactive: string;
  year: number;
  zone: string;
}

const Survey = () => {
  const camera = require('../assets/camera.png');
  const [loading, setLoading] = useState(false);
  const [errorFetch, setError] = useState(false);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [montacargas, setMontacargas] = useState<MontacargasType[]>([]);
  const [failureTypes, setFailureTypes] = useState<FailureType[]>([]);
  const [failureDescriptions, setFailureDescriptions] = useState<FailureType[]>(
    [],
  );
  const [userMaintenance, setUserMaintenance] = useState<MaintenanceType[]>([]);
  const [montacargasToShow, setMontacargasToShow] = useState<MontacargasType[]>(
    [],
  );
  const [currentMachine, setCurrentMachine] = useState<MontacargasType>();
  const [currentSearch, setCurrentSearch] = useState('');

  const [jobData, setJobData] = useState({
    machineId: '',
    failureTypeId: '',
    failureDescriptionId: '',
    comments: '',
    startTime: '',
    endTime: '',
  });

  function hadleSearchMontacargas(value: string) {
    if (value === '') {
      setCurrentSearch('');
      return setMontacargasToShow([]);
    }
    setCurrentSearch(value);
    const lowerValue = value.toLocaleLowerCase();
    const m = montacargas.filter(
      montacarga =>
        montacarga.serial.toLowerCase().startsWith(lowerValue) ||
        montacarga.model.toLowerCase().startsWith(lowerValue) ||
        montacarga.brand.toLowerCase().startsWith(lowerValue),
    );
    setMontacargasToShow(m);
  }

  const getMachines = async () => {
    const { data, error } = await supabase.from('machines').select('*');
    if (error) {
      console.error(error);
      return setError(true);
    }
    setMachines(data as Machine[]);
    setLoading(false);
  };

  const getMontacargas = async () => {
    const { data, error } = await supabase.from('montacargas').select('*');
    if (error) {
      console.error(error);
      return setError(true);
    }
    setMontacargas(data as MontacargasType[]);
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

  const startTimer = async () => {
    setLoading(true);
    const { error } = await supabase.from('maintenance').insert({
      machine_id: jobData.machineId,
      failure_type_id: jobData.failureTypeId,
      failure_desc_id: jobData.failureDescriptionId,
      comments: jobData.comments,
      user_id: USER_ID,
      start: Date.now(),
    });

    if (error) {
      console.error(error);
      return setError(true);
    }
    await getMaintenance();
    setLoading(false);
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
    setUserMaintenance(data as MaintenanceType[]);
  };

  const stopTimer = async () => {
    setLoading(true);
    if (userMaintenance.length > 0) {
      const { error } = await supabase
        .from('maintenance')
        .update({
          end: Date.now(),
        })
        .match({ id: userMaintenance[userMaintenance.length - 1].id });
      if (error) {
        console.error(error);
        return setError(true);
      }
      await getMaintenance();
      setLoading(false);
    }
  };

  const startDisabled =
    jobData.machineId === '' ||
    jobData.failureTypeId === '' ||
    jobData.failureDescriptionId === '';
  const currentJob = userMaintenance[userMaintenance.length - 1];
  const hasJobStarted = userMaintenance.length > 0 && currentJob.end === null;

  useEffect(() => {
    try {
      setLoading(true);
      getMontacargas();
      getMachines();
      getFailureTypes();
      getFailureDescriptions();
      getMaintenance();
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.white,
        }}>
        <Spinner />
        <Caption>Cargando información</Caption>
      </SafeAreaView>
    );
  }

  if (hasJobStarted) {
    console.log(currentJob.start, typeof currentJob.start);
    const d = new Date(Number(currentJob.start));
    d.setHours(d.getHours() - 1);
    const day = d.toLocaleDateString('es-MX', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Heading>Orden de trabajo: {currentJob.id}</Heading>
          <Body size="large" weight="500">
            Tipo de fallo:{' '}
            {
              failureTypes.filter(
                failure => failure.id === currentJob.failure_type_id,
              )[0]?.description
            }
          </Body>
          <Body size="large" weight="500">
            Máquina:{' '}
            {
              montacargas.filter(
                machine => machine.machine_id === currentJob.machine_id,
              )[0]?.model
            }
          </Body>
          <Body size="large" weight="500">
            Descripción:{' '}
            {
              failureDescriptions.filter(
                failure => failure.id === currentJob.failure_desc_id,
              )[0]?.description
            }
          </Body>
          {currentJob?.comments && (
            <Body size="large" weight="500">
              Comentarios: {currentJob.comments}
            </Body>
          )}
          <Body size="large" weight="500">
            Inicio: {day}
          </Body>
          <TextField
            label="Comentarios adicionales"
            size="small"
            placeholder="Comentarios"
            onChangeText={value => setJobData({ ...jobData, comments: value })}
            UNSAFE_style={styles.top}
          />
          <Pressable onPress={() => {}} style={styles.timerContainer}>
            <Image
              source={camera}
              style={{ width: 40, height: 80, objectFit: 'contain' }}
            />
          </Pressable>

          <Button onPress={stopTimer}>Terminar</Button>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <Heading>Registrar orden de trabajo</Heading>
      {errorFetch && <Heading>Something went wrong</Heading>}
      {loading && !errorFetch ? (
        <Spinner />
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.margin}>
            <TextField
              label="Buscar montacargas"
              size="small"
              placeholder="Ingresa el montacargas"
              type="text"
              onChangeText={value => hadleSearchMontacargas(String(value))}
              value={currentSearch}
            />
            {montacargasToShow.length > 0 && (
              <View style={styles.box}>
                {montacargasToShow.map((maq, index) => {
                  return (
                    index <= 2 && (
                      <Pressable
                        key={maq.serial}
                        style={{ marginVertical: 4 }}
                        onPress={() => {
                          setCurrentMachine(maq);
                          setMontacargasToShow([]);
                          setCurrentSearch('');
                          setJobData({
                            ...jobData,
                            machineId: maq.machine_id,
                          });
                        }}>
                        <Caption weight="700">
                          Marca: {maq.brand} | No. Serie: {maq.serial} | Modelo:{' '}
                          {maq.model} |
                        </Caption>
                      </Pressable>
                    )
                  );
                })}
              </View>
            )}
            {currentMachine && (
              <View style={{ flexDirection: 'column', gap: 4 }}>
                <Body>
                  <>
                    <Body weight="700">Marca:</Body> {currentMachine.brand}
                  </>
                </Body>
                <Body>
                  <>
                    <Body weight="700">Modelo:</Body> {currentMachine.model}
                  </>
                </Body>
                <Body>
                  <>
                    <Body weight="700">No de Serie:</Body>{' '}
                    {currentMachine.serial}
                  </>
                </Body>
              </View>
            )}
          </View>
          <View style={styles.margin}>
            <Select
              size="small"
              style={styles.margin}
              placeholder="Selecciona una falla"
              label="Falla"
              onChange={value => {
                setJobData({
                  ...jobData,
                  failureTypeId: failureTypes.filter(
                    fail => fail.description === value[0].text,
                  )[0].id,
                });
              }}
              selectOptions={failureTypes.map(failure => {
                return {
                  text: failure.description,
                };
              })}
            />
          </View>
          <View style={styles.margin}>
            <Select
              size="small"
              style={styles.margin}
              placeholder="Selecciona una descripción"
              label="Descripción"
              onChange={value => {
                setJobData({
                  ...jobData,
                  failureDescriptionId: failureDescriptions.filter(
                    fail => fail.description === value[0].text,
                  )[0].id,
                });
              }}
              selectOptions={failureDescriptions.map(failure => {
                return {
                  text: failure.description,
                };
              })}
            />
          </View>
          <TextArea
            label="Comentarios adicionales"
            size="small"
            placeholder="Comentarios"
            onChangeText={value => setJobData({ ...jobData, comments: value })}
            UNSAFE_style={styles.top}
          />
          <Pressable onPress={() => {}} style={styles.timerContainer}>
            <Image
              source={camera}
              style={{ width: 40, height: 80, objectFit: 'contain' }}
            />
          </Pressable>
          <Button disabled={startDisabled} onPress={startTimer}>
            Empezar
          </Button>
        </SafeAreaView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gray['40'],
    borderRadius: 8,
    borderCurve: 'circular',
    borderStyle: 'dashed',
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  margin: {
    marginBottom: 16,
  },
  top: {
    marginTop: 16,
    backgroundColor: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    elevation: 2,
    padding: 16,
    borderRadius: 8,
    borderCurve: 'circular',
    gap: 16,
  },
  box: {
    flex: 1,
    backgroundColor: colors.white,
    elevation: 2,
    padding: 16,
    flexDirection: 'column',
  },
});

export default Survey;
