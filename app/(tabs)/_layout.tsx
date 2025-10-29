import React from 'react'
import { Tabs } from 'expo-router'

const Layout = () => {
  return (
    <Tabs screenOptions={{headerShown:false}} >
        <Tabs.Screen name='home' options={{title: 'Home'}}/>
        <Tabs.Screen name='informasi' options={{title: 'Informasi'}}/>
        <Tabs.Screen name='panduan' options={{title: 'Panduan'}}/>
    </Tabs>
  )
}

export default Layout