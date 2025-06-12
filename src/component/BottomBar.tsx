import React from 'react';
import {View, Colors, TouchableOpacity, Text} from 'react-native-ui-lib';
import tailwind from 'twrnc';
import {navigations} from '../constants/componenetList';
import {NavigationProp, useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../constants/themeContext';

const BottomBar = () => {
  const nav = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const {theme, isDarkMode} = useTheme();

  return (
    <View
      style={[
        tailwind`h-18 w-full flex-row border-t pt-1.5 pb-4 shadow-2xl rounded-t-3xl`,
        {
          backgroundColor: theme.tabBarBackground,
          borderTopColor: theme.border,
        },
      ]}>
      {navigations.map((each: any) => {
        const isActive = route.name === each.key;
        const isAddButton = each.key === 'camera';

        return (
          <TouchableOpacity
            key={each.key}
            onPress={() => nav.navigate(each.key)}
            style={tailwind`flex-1 items-center justify-center py-1`}
            activeOpacity={0.7}>
            {isAddButton ? (
              <View
                style={[
                  tailwind`w-12 h-12 rounded-2xl items-center justify-center shadow-lg -mt-6 border-3`,
                  {
                    backgroundColor: theme.primary,
                    borderColor: theme.tabBarBackground,
                  },
                ]}>
                <Ionicons
                  name={isActive ? each.focusedIcon : each.unfocusedIcon}
                  size={24}
                  color="white"
                />
              </View>
            ) : (
              <View
                style={[
                  tailwind`items-center justify-center px-2 py-1.5 rounded-xl min-w-16`,
                  isActive && {
                    backgroundColor: isDarkMode ? theme.border : '#dbeafe',
                  },
                ]}>
                <Ionicons
                  name={
                    isActive
                      ? each.focusedIcon ?? each.unfocusedIcon
                      : each.unfocusedIcon
                  }
                  size={isActive ? 24 : 22}
                  color={isActive ? theme.primary : theme.textSecondary}
                  style={tailwind`mb-0.5`}
                />
                <Text
                  text90
                  style={[
                    tailwind`text-xs text-center`,
                    isActive ? tailwind`font-semibold` : tailwind`font-medium`,
                    {color: isActive ? theme.primary : theme.textSecondary},
                  ]}>
                  {each.title}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomBar;
