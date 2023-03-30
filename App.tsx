// filename: App.tsx


/// shims
import '@sinonjs/text-encoding'
import 'react-native-get-random-values'
import '@ethersproject/shims'
import 'cross-fetch/polyfill'

import React, { isValidElement, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, Text, Button, Alert, Share, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import {Picker} from '@react-native-picker/picker'

// Import the agent from our earlier setup
import { agent } from './setup'
// import some data types:
import { IIdentifier } from '@veramo/core'
import { VerifiableCredential } from '@veramo/core'
import { issuerCreateSchema } from 'indy-sdk'


const App = () => {
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>([])
  const [credential, setCredential] = useState<VerifiableCredential | undefined>()
  const [did, setDid] = useState<string>('')
  const [courseName, setCourseName] = useState<string>('')
  const [grade, setGrade] = useState<string>('')
  const [rollNo, setRollNo] = useState<string>('')
  const  [items, setItems] = useState<any>()







  const onShare = async () => {
    try {
      const result = await Share.share({
        message: JSON.stringify({credential: credential}, null, 2),
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };



  const createCredential = async (did: string, rollNo: string, courseName: string, grade: string) => {
    if (identifiers[0].did) {
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: identifiers[0].did },
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: did,
            RollNo: rollNo,
            Course: courseName,
            Grade: grade

          },
        },
        save: false,
        proofFormat: 'jwt',
      })

      setCredential(verifiableCredential)
    }
  }

  // Add the new identifier to state
  const createIdentifier = async () => {
    const _id = await agent.didManagerCreate({
      provider: 'did:ethr:goerli',
        })
    setIdentifiers((s) => s.concat([_id]))
  }


  const styles = StyleSheet.create({
 
    container: {
      backgroundColor: '#E5E8E8',
      width:'97%',
      height:'85%',
      margin:10,
      
    },
  
    inner:{
       marginTop:30,
       marginLeft:30,
       flex:1,
       flexDirection:'column',
       gap:10,
    },
    label:{
        fontSize:25,
  
    },
    input:{
      marginBottom:20,
      height:40,
      fontSize:20,
      borderWidth:1,
      borderColor:'black',
      marginRight:10,
      backgroundColor: 'white',
      padding:6
      
    },
  
    heading: {
      fontSize: 40,
      marginTop:20,
      marginLeft:10,
      fontFamily: 'Roboto',
      fontWeight: 'bold'
    },
    subhead: {
      fontSize: 25,
      marginTop:10,
      marginLeft:10,
      fontWeight:'bold'
  
    },
    green: {
      borderColor: 'green',
  },
  red: {
      borderColor: 'red',
  },

  });

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
      <ScrollView>
        <View style={{ padding: 20 }}>

          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Identifiers</Text>
          <Button onPress={() => createIdentifier()} title={'Create Identifier'} />
          <View style={{ marginBottom: 50, marginTop: 20 }}>
            {identifiers && identifiers.length > 0 ? (
              identifiers.map((id: IIdentifier) => (
                <View key={id.did}>
                  <Text>{JSON.stringify(id.did , null, 2)} {'\n'}</Text>
                </View>))
            ) : (
              <Text>No identifiers created yet</Text>

                )}
    
        <Text style = {styles.heading}>ISSUE NEW VC</Text>
        <Text style = {styles.subhead}>Students details</Text>

        <View style = {styles.container}>
      <View style = {styles.inner}>
      <Text style = {styles.label}>DID</Text>

<Picker
       selectedValue={did}
       onValueChange={(itemValue, itemIndex) =>
         setDid(itemValue)
       }>

       <Picker.Item label={JSON.stringify(identifiers[1])} value={JSON.stringify(identifiers[1])}/>
       <Picker.Item label={JSON.stringify(identifiers[2])} value={JSON.stringify(identifiers[2])}/>
       <Picker.Item label={JSON.stringify(identifiers[3])} value={JSON.stringify(identifiers[3])}/>

     </Picker>

        <Text style = {styles.label}>Course Name</Text>
         <TextInput onChangeText={setCourseName} style = {styles.input} placeholder='Enter the course name'/>

         
         
         <Text style = {styles.label}>Roll Number</Text>
         <TextInput style = {styles.input} onChangeText={setRollNo} placeholder='Enter the roll'/>

         <Text style = {styles.label}>Grade</Text>
         <TextInput style = {styles.input} onChangeText={setGrade} placeholder='Enter the Grade'/>

         <Button
            title={'Create Credential'}
            disabled={!identifiers || identifiers.length === 0}

            onPress={() => createCredential(did, rollNo, courseName, grade)}
          />

                      <Text>Roll Number: {credential?.credentialSubject.RollNo}</Text>
                      <Text>Course Name: {credential?.credentialSubject.Course}</Text>
                      <Text>Grade: {credential?.credentialSubject.Grade}</Text>


          <Button onPress={onShare} title="Share" />
      </View>
</View>


            


          
        </View>
        </View>

      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )

  
    
}

export default App