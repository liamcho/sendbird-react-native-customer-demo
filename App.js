/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Sendbird
 */
import SendBird from 'sendbird';
import SendBirdSyncManager from 'sendbird-syncmanager';

/**
 * REPLACE WITH YOUR DATA HERE
 */
const sb = new SendBird({ appId: 'D1CB1742-A4A3-44B9-9E7F-126D14BAB34B' });
const userId = 'test2';
const accessToken = null;

const App = () => {
  SendBirdSyncManager.sendBird = sb;
  SendBirdSyncManager.useReactNative(AsyncStorage);
  SendBirdSyncManager.setup(userId, (err) => {
    console.log('## err: ', err);
    sb.connect(userId, accessToken, (user, error) => {
      console.log('## Connected error: ' + error);
      if (!error) {
        sb.GroupChannel.getChannel(
          'sendbird_group_channel_73419790_a79f1a90153aa009552dae563bb3286cfd1e51ac',
          (channel, err) => {
            if (err) throw err;
            // channel.sendUserMessage('test message', (message, err) => {
            //   if (err) throw err;
            const messageParams = new sb.UserMessageParams();
            messageParams.message = 'changed!';
            channel.updateUserMessage(873918899, messageParams, (message, err) => {
              if (err) throw err;
              const listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
              listQuery.limit = 20;
              listQuery.order = 'latest_last_message';
              listQuery.includeEmpty = false;

              // listQuery.next((list, err) => {
              //     if (err) throw err;
              //     console.log('## list:', list.length);
              //
              //     list.forEach(channel => {
              //         console.log('## channel 1: ', channel.url);
              //         console.log('## time: ', channel.createdAt / 1000);
              //     });
              // });
              console.log('## SendBirdSyncManager.ChannelCollection: ', SendBirdSyncManager.ChannelCollection);
              const collection = new SendBirdSyncManager.ChannelCollection(listQuery);
              const handler = new SendBirdSyncManager.ChannelCollection.CollectionHandler();

              handler.onChannelEvent = (action, channels) => {
                console.log('## channels 2: ', channels.length);
                channels.forEach(channel => {
                  console.log('## channel 2: ', channel.url);
                  console.log('## time: ', channel.createdAt / 1000);
                });

                console.log('## action', action);

                switch (action) {
                  case 'insert':
                    // Add channels to the view.
                    break;
                  case 'update':
                    // Update channels in the view.
                    break;
                  case 'move':
                    // Change the position of channels in the view.
                    break;
                  case 'remove':
                    // Remove channels from the view.
                    break;
                  case 'clear':
                    // Clear the view.
                    break;
                }
              };

              collection.setCollectionHandler(handler);
              collection.fetch();

              const messageCollection = new SendBirdSyncManager.MessageCollection(channel);
              messageCollection.limit = 30;

              const collectionHandler = new SendBirdSyncManager.MessageCollection.CollectionHandler();
              collectionHandler.onSucceededMessageEvent = (messages, action) => {
                console.log('##3 action', action);
                console.log('##3 messages', messages.length);
                if (action === 'insert') {
                } else if (action === 'remove') {
                }
              };

              messageCollection.setCollectionHandler(collectionHandler);
              messageCollection.fetchSucceededMessages('prev');
              messageCollection.fetchSucceededMessages('next');
            });
          });
        // });
      }
    });
  });

  /**
   * Connect to Sendbird
   */
  // sb.connect(userId, accessToken, (user, error) => {
  //     console.log('## Connected error: ' + error);
  //     if (!error) {
  // Create a channel
  // sb.GroupChannel.createChannel([userId], (groupChannel, error) => {
  //     if (error) {
  //         console.log('Error creating group channel:');
  //         console.log(error);
  //     }
  // });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <Text style={styles.sectionTitle}>
            Check your console
          </Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  }
});

export default App;
