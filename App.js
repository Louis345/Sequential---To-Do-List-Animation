import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  LayoutAnimation,
  Dimensions
} from 'react-native';
import Card from './Card';
const { width } = Dimensions;
import { PanGestureHandler } from 'react-native-gesture-handler';
const toDoList = ['clean house', 'go out to eat'];
const colors = ['#F4F4F4', '#F4F4F4', '#F4F4F4', '#F4F4F4'];
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
