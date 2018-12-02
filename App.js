import React from 'react';
import { StyleSheet, View } from 'react-native';
import Card from './Card';
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Card />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3197C3'
  }
});
