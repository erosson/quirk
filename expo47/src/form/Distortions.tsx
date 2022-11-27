import React from "react"
import { SelectorTextItem, SubHeader } from "../ui"
import { View, ScrollView } from "react-native"
import i18n from "../i18n"
import * as Distortion from "../distortions"
import theme from "../theme"
import PropTypes from "prop-types"

export default (props: {
  list?: Distortion.Distortion[]
  selected: Set<Distortion.Distortion>
  onChange: (slug: string) => void
}) => {
  const list: Distortion.Distortion[] = props.list ?? Distortion.sortedList()
  const items: { distortion: Distortion.Distortion; selected: boolean }[] =
    list.map((distortion) => ({
      distortion,
      selected: props.selected.has(distortion),
    }))
  return (
    <>
      <ScrollView>
        <View
          style={{
            paddingBottom: 160,
          }}
        >
          <SubHeader
            style={{
              marginBottom: 6,
            }}
          >
            {i18n.t("cog_distortion")}
          </SubHeader>
          <RoundedSelector items={items} onPress={props.onChange} />
        </View>
      </ScrollView>
    </>
  )
}

function RoundedSelector(props: {
  items: { selected: boolean; distortion: Distortion.Distortion }[]
  onPress: (slug: string) => void
  style: any
}) {
  return (
    <View
      style={{
        backgroundColor: theme.lightOffwhite,
        ...props.style,
      }}
    >
      {props.items.map(({ distortion, selected }) => {
        return (
          <SelectorTextItem
            key={distortion.slug}
            emoji={distortion.emoji()}
            text={distortion.label()}
            description={distortion.description()}
            selected={selected}
            onPress={() => props.onPress(distortion.slug)}
          />
        )
      })}
    </View>
  )
}

RoundedSelector.propTypes = {
  items: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
}
