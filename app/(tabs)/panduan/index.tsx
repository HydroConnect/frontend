import React from 'react'
import Panduan from '@/src/modules/panduan/Panduan'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'


const index = () => {
  return (
    <SafeAreaView style={{flex:1}} edges={['top']}>
        <StatusBar backgroundColor='white' style='dark' />
      <Panduan/>
    </SafeAreaView>
  )
}

export default index