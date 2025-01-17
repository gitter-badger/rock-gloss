import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import { DrawerActions } from 'react-navigation-drawer';
import { AdMobBanner } from 'expo-ads-admob';
import _orderBy from 'lodash/fp/orderBy';
import _deburr from 'lodash/deburr';

import TermList from '../views/TermList'
import AppSettings from '../AppSettings'
import terms from '../assets/files/terms.json';
import conf from '../conf/conf.json'
import ScreenNavigationAnalytics from '../components/ScreenNaviationAnalytics'

const adMobTestAdUnitId = "ca-app-pub-3940256099942544/6300978111"

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAd: true,
      settings: {
        adsEnabled: true,
      },
    }
  }
  
  render() {
    const {
      showAd,
      settings: {
        adsEnabled
      },
    } = this.state
    const adUnitId = __DEV__ ? adMobTestAdUnitId : conf.adMob.bannerAdUnitId
    const orderedTerms = _orderBy(sortTermsIteratee)(['asc'])(terms)
    return (
      <View style={styles.container}>
        <TermList terms={orderedTerms} />
        {adsEnabled && showAd && (
          <AdMobBanner
            bannerSize="fullBanner"
            adUnitID={adUnitId}
            testDeviceID={AdMobBanner.simulatorId}
            onAdViewDidReceiveAd={this.onAdViewDidReceiveAd}
            onDidFailToReceiveAdWithError={this.onDidFailToReceiveAdWithError}
          />
        )}
        <ScreenNavigationAnalytics screenName="terms" />
      </View>
    );
  }
  
  componentDidMount = () => {
    AppSettings.getSettingsAsync().then((settings) => this.setState({
      settings: {...this.state.settings, ...settings},
    }))
  }

  onAdViewDidReceiveAd = () => {
    this.setState({
      showAd: true
    })
  }

  onDidFailToReceiveAdWithError = (error) => {
    // console.error("bannerError", error)
    this.setState({
      showAd: false
    })
  }
}

function sortTermsIteratee(term) {
  const title = _deburr(term.title).toLowerCase();
  // We want to sort words like "b"-grade and 'scend starting with their second letter
  if (title.startsWith('"') || title.startsWith("'")) {
    return title.substr(1);
  }
  return title;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
