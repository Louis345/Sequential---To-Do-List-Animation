import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  LayoutAnimation,
  UIManager,
  Dimensions,
  Extrapolate
} from 'react-native';
const colors = ['#FFFFFD', '#FFFFFD', '#FFFFFD', '#FFFFFD'];
const { concat } = Animated;
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;
export default class Card extends React.Component {
  state = {
    animation: new Animated.ValueXY(0),
    interpolate: new Animated.Value(0),
    cardList: ['clean house', 'go out to eat', 'test', 'hi'],
    swipedCardIndex: 0
  };
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        this.state.animation.setValue({
          x: gestureState.dx,
          y: gestureState.dy
        });
      },
      onPanResponderRelease: (event, gestureState) => {
        // LayoutAnimation.configureNext(
        //   animationConfigs.get(this.state.animation)
        // );
        if (gestureState.dx > SWIPE_THRESHOLD) {
          Animated.spring(this.state.animation, {
            toValue: { x: width, y: 0, duration: 0 }
          }).start(() => {
            this.onSwipeComplete();
          });
        } else {
          Animated.timing(this.state.animation, {
            toValue: { x: 0, y: 0, duration: 250 }
          }).start();
        }
      }
    });
  }

  onSwipeComplete() {
    this.state.animation.setValue({ x: 0, y: 0 });
    this.setState({ swipedCardIndex: this.state.swipedCardIndex + 1 });
  }

  renderCardList = () => {
    const { animation } = this.state;

    const rotateZ = animation.x.interpolate({
      inputRange: [(-width / 2) * 1.5, 0, (width / 2) * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    const scaleInterpolate = this.state.interpolate.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgb(255,99,71)', 'rgb(99,71,255)']
    });

    const animatedStyles = {
      // transform: this.state.animation.getTranslateTransform()
      transform: [
        { translateX: this.state.animation.x },
        { translateY: this.state.animation.y },
        { rotateZ }
      ]
    };

    const backgroundColorStyles = {
      backgroundColor: scaleInterpolate
    };

    const { cardList, swipedCardIndex } = this.state;
    console.log(swipedCardIndex);
    let scale = 1.0;
    let bottom = 10;
    let zIndex = 0;
    return cardList.map((item, index) => {
      scale -= 0.1;
      bottom += index === 0 ? 0 : 20;
      if (index < swipedCardIndex) {
        console.log('not displaying card');
        return null;
      }
      if (index === swipedCardIndex) {
        console.log('matching');
        return (
          <Animated.View
            {...this._panResponder.panHandlers}
            style={[
              {
                width: 300,
                height: 290,
                position: 'absolute',
                zIndex: cardList.length - index,
                bottom: 0,
                backgroundColor: colors[index],
                opacity: 1,
                transform: [{ scale: scale }],
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5
              },
              animatedStyles,
              backgroundColorStyles
            ]}
            key={index}
          >
            <Text style={styles.text}>{item}</Text>
          </Animated.View>
        );
      }
      {
        console.log('showing remaining cards');
      }
      return (
        <View
          style={[
            {
              width: 300,
              height: 300,
              position: 'absolute',
              zIndex: cardList.length - index,
              bottom: bottom,
              backgroundColor: colors[index],
              opacity: 1,
              transform: [{ scale: scale }],
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5
            }
          ]}
          key={index}
        >
          <Text style={styles.text}>{item}</Text>
        </View>
      );
    });
  };

  render() {
    return <View style={styles.container}>{this.renderCardList()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100
  },
  box0: {
    width: 300,
    height: 150,
    position: 'absolute',
    zIndex: 1,
    bottom: 60,
    backgroundColor: 'red',
    opacity: 0.3,
    transform: [{ scale: 0.7 }],
    justifyContent: 'center',
    alignItems: 'center'
  },
  box1: {
    width: 300,
    height: 150,
    position: 'absolute',
    zIndex: 1,
    bottom: 40,
    backgroundColor: 'red',
    opacity: 0.3,
    transform: [{ scale: 0.8 }],
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  box2: {
    width: 300,
    height: 150,
    position: 'absolute',
    zIndex: 2,
    bottom: 20,
    backgroundColor: 'green',
    opacity: 0.6,
    transform: [{ scale: 0.9 }],
    justifyContent: 'center',
    alignItems: 'center'
  },
  box3: {
    width: 300,
    height: 150,
    position: 'absolute',
    zIndex: 3,
    bottom: 0,
    backgroundColor: 'blue',
    opacity: 1,
    transform: [{ scale: 1.0 }],
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#ffffff',
    fontSize: 10
  }
});
