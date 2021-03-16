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
    StatusBar,
} from 'react-native';

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


/**
 * Sendbird
 */
import SendBird from 'sendbird';
import {listChannels} from "./src/Tests";
/**
 * REPLACE WITH YOUR DATA HERE
 */
const sb = new SendBird({ appId: 'D1CB1742-A4A3-44B9-9E7F-126D14BAB34B' });
const userId = 'test2';
const accessToken = null;
const groupChannelUrl = 'test-channel';

const App = () => {
    /**
     * Connect to Sendbird
     */
    sb.connect(userId, accessToken, (user, error) => {
        console.log('Connected error: ' + error);
        if (!error) {
            // Create a channel
            // sb.GroupChannel.createChannel([userId], (groupChannel, error) => {
            //     if (error) {
            //         console.log('Error creating group channel:');
            //         console.log(error);
            //     }
            // });
            sb.GroupChannel.getChannel('sendbird_group_channel_73419790_a79f1a90153aa009552dae563bb3286cfd1e51ac', (channel, err) => {
                if (err) throw err;
                channel.sendUserMessage('test message', (message, err) => {
                    if (err) throw err;
                    listChannels(sb);
                });
            });
        }
    });

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
