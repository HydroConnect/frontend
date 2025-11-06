import React from 'react'
import Informasi from '@/src/modules/informasi/Informasi'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

const index = () => {
  return (
    <SafeAreaView style={{flex:1}} edges={['top']}>
        <StatusBar backgroundColor='white' style='dark' />
      <Informasi/>
    </SafeAreaView>
  )
}

export default index