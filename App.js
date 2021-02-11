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
/**
 * REPLACE WITH YOUR DATA HERE
 */
const sb = new SendBird({ appId: 'YOUR APP ID HERE'});
const userId = 'YOUR USER ID HERE';
const accessToken = null;
const groupChannelUrl = 'YOUR CHANNEL HERE';

const App = () => {
    /**
     * Connect to Sendbird
     */
    sb.connect(userId, accessToken, (user, error) => {
        console.log('Connected error: ' + error);
        if (!error) {
            console.log(user);
            sb.GroupChannel.getChannel(groupChannelUrl, (groupChannel, error) => {
                if (error) {
                    console.log('Error listing group channel messages:');
                    console.log(error);
                } else {
                    /**
                     * List messages
                     */
                    var prevMessageListQuery = groupChannel.createPreviousMessageListQuery();
                    prevMessageListQuery.limit = 100;
                    prevMessageListQuery.reverse = false;
                    prevMessageListQuery.includeMetaArray = true;
                    /**
                     * Include threading and reply
                     */
                    prevMessageListQuery.includeReplies = true;
                    prevMessageListQuery.includeThreadInfo = true;
                    prevMessageListQuery.includeParentMessageText = true;
                    /**
                     * Get
                     */
                    prevMessageListQuery.load((messages, error) => {
                        if (error) {
                            console.log('Error listing messages for group channel:');
                            console.dir(error);
                            return;
                        }
                        console.log('Messages:'); 
                        for (const msg of messages) {
                            if (msg.messageType == 'file') {
                                console.log(msg.url);
                            }
                        }
                    });        
                }    
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
