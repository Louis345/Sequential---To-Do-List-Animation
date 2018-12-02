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
  Easing
} from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
const colors = ['#FFFFFD', '#FFFFFD', '#FFFFFD', '#FFFFFD', '#FFFFFD'];

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.2;
const CARD_WIDTH = 360;
const CARD_HEIGHT = 300;
export default class Card extends React.Component {
  state = {
    animation: new Animated.ValueXY(0),
    interpolate: new Animated.Value(0),
    iconOpacity: new Animated.Value(0),
    scale: new Animated.Value(0.7),
    keepTrackOfScale: 0.7,
    cardList: ['clean house', 'go out to eat', 'test', 'hi'],
    swipedCardIndex: 0
  };

  // componentWillUpdate() {
  //   const animationConfigs = {
  //     duration: 700,
  //     create: {
  //       type: 'linear',
  //       property: 'opacity'
  //     },
  //     update: {
  //       type: 'spring',
  //       springDamping: 0.4,
  //       property: 'scaleXY'
  //     },
  //     delete: {
  //       type: 'linear',
  //       property: 'opacity'
  //     }
  //   };
  //   UIManager.setLayoutAnimationEnabledExperimental &&
  //     UIManager.setLayoutAnimationEnabledExperimental(true);

  //   LayoutAnimation.configureNext(animationConfigs);
  // }

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
        if (gestureState.dx > SWIPE_THRESHOLD * 0.3) {
          Animated.timing(this.state.iconOpacity, {
            toValue: 0.5,
            duration: 100
          }).start(() => {
            this.state.iconOpacity.setValue(0);
          });
        }
        if (gestureState.dx > SWIPE_THRESHOLD) {
          Animated.timing(this.state.interpolate, {
            toValue: 1,
            duration: 100
          }).start();
          Animated.timing(this.state.animation, {
            toValue: { x: width * 2, y: 0, duration: 100 }
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
    let { keepTrackOfScale } = this.state;

    this.setState(
      {
        swipedCardIndex: this.state.swipedCardIndex + 1,
        keepTrackOfScale: keepTrackOfScale + 0.02,
        cardList: this.state.cardList.filter((card, index) => index !== 0)
      },
      () => {
        UIManager.setLayoutAnimationEnabledExperimental &&
          UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        this.state.animation.setValue({ x: 0, y: 0 });
        this.state.interpolate.setValue(0);
        Animated.timing(this.state.opacityStyles, {
          toValue: 1,
          duration: 100
        });

        Animated.timing(this.state.scale, {
          toValue: keepTrackOfScale,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear
        }).start();
      }
    );
  }

  renderCardList = () => {
    const { animation, iconOpacity } = this.state;

    const rotateZ = animation.x.interpolate({
      inputRange: [(-width / 2) * 1.5, 0, (width / 2) * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    const animatedStyles = {
      // transform: this.state.animation.getTranslateTransform()
      transform: [{ translateX: this.state.animation.x }, { rotateZ }]
    };

    const opacityStyles = {
      opacity: iconOpacity
    };

    const { cardList } = this.state;

    let scale = 1.1;
    let bottom = 10;

    return cardList.map((item, index) => {
      bottom += index === 0 ? 0 : 20;
      scale -= 0.1;
      // if (index < swipedCardIndex) {
      //   return null;
      // }
      if (index === 0) {
        return (
          <Animated.View
            {...this._panResponder.panHandlers}
            style={[
              {
                width: CARD_WIDTH,
                height: CARD_HEIGHT + 10,
                position: 'absolute',
                zIndex: cardList.length - index,
                bottom: 0,
                backgroundColor: '#E9E9E8',
                borderRadius: 5
              },
              animatedStyles
            ]}
            key={index}
          >
            <View style={styles.textContainer}>
              <Text style={styles.title}>Take The Dog Out</Text>
            </View>
            <View style={styles.lineSperator} />
            <View>
              <Animated.View
                style={[
                  {
                    zIndex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  },
                  opacityStyles
                ]}
              >
                <EvilIcons name="check" size={CARD_WIDTH - 60} color="green" />
              </Animated.View>

              <View style={{ zIndex: 0, position: 'absolute' }}>
                <Text style={styles.noteText}>Notes:</Text>
                <Text style={styles.text}>{item}</Text>
              </View>
            </View>
          </Animated.View>
        );
      }

      return (
        <View
          style={[
            {
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              position: 'absolute',
              zIndex: cardList.length - index,
              bottom: bottom + 1,
              backgroundColor: '#E9E9E8',
              opacity: 1,
              transform: [{ scale: scale }],
              borderRadius: 5
            }
          ]}
          key={index}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>Take The Dog Out</Text>
          </View>
          <View style={styles.lineSperator} />

          <Text style={styles.noteText}>Notes:</Text>

          <Text style={styles.text}>{item}</Text>
        </View>
      );
    });
  };

  render() {
    const { scale } = this.state;
    console.log(scale);
    const animatedStyles = {
      // transform: this.state.animation.getTranslateTransform()
      transform: [{ scale: scale }]
    };
    return (
      <Animated.View
        style={[
          {
            flex: 0.6,
            height: 100
          },
          animatedStyles
        ]}
      >
        {this.renderCardList()}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  text: {
    color: '#454544',
    fontSize: 20,
    marginLeft: 20
  },
  title: {
    alignItems: 'flex-start',
    fontSize: 30,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20
  },
  textContainer: {
    marginLeft: 20
  },
  noteText: {
    color: '#BDBDBD',
    fontSize: 25,
    marginLeft: 20,
    marginBottom: 10,
    zIndex: -1
  },
  lineSperator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: CARD_WIDTH
  }
});
