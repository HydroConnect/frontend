import React from 'react'
import Home from '@/src/modules/home/Home'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

const index = () => {
  return (
    <SafeAreaView style={{flex:1}} edges={['top']}>
        <StatusBar backgroundColor='white' style='dark' />
      <Home/>
    </SafeAreaView>
  )
}

export default index