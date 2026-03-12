// @ts-ignore -- We need to import React for JSX support in Storybook internals
import React from "react"

import {
  Controls,
  Stories,
  Subtitle,
  Title,
  useOf,
  Subheading,
  Description,
} from "@storybook/addon-docs/blocks"

import { PrimaryCanvas } from "./PrimaryCanvas"

const ControlsHeadline = () => {
  const { story } = useOf("story", ["story"])
  const hasControls = Object.values(story.argTypes).length > 0
  return !hasControls ? null : <Subheading>Props</Subheading>
}

const SingleStoryTemplate = () => (
  <>
    <Title />
    <Subtitle />
    <Description of="meta" />
    <Description of="story" />
    <Subheading>Example</Subheading>
    <PrimaryCanvas />
    <ControlsHeadline />
    <Controls />
  </>
)

const MultiStoryTemplate = () => (
  <>
    <Title />
    <Subtitle />
    <Description of="meta" />
    <Subheading>Example</Subheading>
    <PrimaryCanvas />
    <ControlsHeadline />
    <Controls />
    <Stories />
  </>
)

export const AutoDocsTemplate = () => {
  const resolvedOf = useOf("meta", ["meta"])
  const { stories } = resolvedOf.csfFile
  const isSingleStory = Object.keys(stories).length === 1

  return isSingleStory ? <SingleStoryTemplate /> : <MultiStoryTemplate />
}
