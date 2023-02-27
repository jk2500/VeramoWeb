// filename: App.tsx

/// shims
import '@sinonjs/text-encoding'
import 'react-native-get-random-values'
import '@ethersproject/shims'
import 'cross-fetch/polyfill'

import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, Text, Button, Alert, Share } from 'react-native'

// Import the agent from our earlier setup
import { agent } from './setup'
// import some data types:
import { IIdentifier } from '@veramo/core'
import { VerifiableCredential } from '@veramo/core'


const App = () => {
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>([])
  const [credential, setCredential] = useState<VerifiableCredential | undefined>()




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



  const createCredential = async () => {
    if (identifiers[0].did) {
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: identifiers[0].did },
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: identifiers[1].did,
            you: 'Rock',
            RollNo: 'AA00A000',
            Course: 'Functions in Several Variables',
            Grade: 'B'

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

  // Check for existing identifers on load and set them to state
  useEffect(() => {
    const getIdentifiers = async () => {
      const _ids = await agent.didManagerFind()
      setIdentifiers(_ids)

      // Inspect the id object in your debug tool
      console.log('_ids:', _ids)
    }

    getIdentifiers()
  }, [])

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Identifiers</Text>
          <Button onPress={() => createIdentifier()} title={'Create Identifier'} />
          <View style={{ marginBottom: 50, marginTop: 20 }}>
            {identifiers && identifiers.length > 0 ? (
              identifiers.map((id: IIdentifier) => (
                <View key={id.did}>
                  <Text>{JSON.stringify(id.did, null, 2)}</Text>
                </View>
              ))
            ) : (
              <Text>No identifiers created yet</Text>
            )}
          </View>
        </View>

        <View style={{ padding: 20 }}>
          <Button
            title={'Create Credential'}
            disabled={!identifiers || identifiers.length === 0}
            onPress={() => createCredential()}
          />
          <Text style={{ fontSize: 10 }}>{JSON.stringify(credential, null, 2)}</Text>

          <Button onPress={onShare} title="Share" />
        </View>


      </ScrollView>
    </SafeAreaView>
  )
}

export default App