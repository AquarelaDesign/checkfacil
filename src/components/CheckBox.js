import React from 'react'
import PropTypes from "prop-types"
import Icon from "react-native-vector-icons/FontAwesome"
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'

export default function CheckBox(props) {
  function handleChange() {
    const { onChange } = props
    if (onChange) {
      return onChange()
    }
  }

  return (
    <View style={styles.WrapperCheckBox}>
      <TouchableOpacity onPress={handleChange} style={[
        styles.CheckBox,
        { borderColor: props.checkColor ? props.checkColor : '#fff' }
      ]}>
        {props.isChecked ? <Icon name="check"
          style={{
            fontSize: 16,
            color: props.iconColor ? props.iconColor : '#fff'
          }}
        /> : null}
      </TouchableOpacity>

      {props.label &&
        <Text style={[styles.LabelCheck, props.labelStyle]}>
          {props.label}
        </Text>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  CheckBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  WrapperCheckBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#fff',
  },
  LabelCheck: {
    color: '#fff',
    marginLeft: 6
  }
})

CheckBox.propTypes = {
  label: PropTypes.string,
  labelStyle: PropTypes.object,
  iconColor: PropTypes.string,
  onChange: PropTypes.func,
  isChecked: PropTypes.bool,
  checkColor: PropTypes.string
}
