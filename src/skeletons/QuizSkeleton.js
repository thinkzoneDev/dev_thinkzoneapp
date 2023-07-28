import React from 'react';
import * as window from '../utils/dimensions';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const QuizSkeleton = props => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item alignItems="center" justifyContent="center">
        <SkeletonPlaceholder.Item
          marginTop={20}
          marginBottom={20}
          width={window.WindowWidth * 0.9}
          height={39}>
          <SkeletonPlaceholder.Item
            marginTop={10}
            borderRadius={50}
            width={window.WindowWidth * 0.9}
            height={20}></SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            marginTop={50}
            width={window.WindowWidth * 0.9}
            height={120}></SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          marginTop={40}
          marginBottom={20}
          width={window.WindowWidth * 0.9}
          borderRadius={10}
          height={50}></SkeletonPlaceholder.Item>
        {/* <SkeletonPlaceholder.Item
          marginTop={20}
          marginBottom={20}
          borderRadius={10}
          width={window.WindowWidth * 0.9}
          height={50}></SkeletonPlaceholder.Item> */}
        <SkeletonPlaceholder style={{flexDirection: 'row', marginTop: 70}}>
          <SkeletonPlaceholder.Item
            marginTop={20}
            marginBottom={20}
            borderRadius={10}
            marginLeft={5}
            // marginRight={10}
            width={window.WindowWidth * 0.45}
            height={50}></SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            marginTop={20}
            marginBottom={20}
            borderRadius={10}
            marginLeft={5}
            // marginRight={10}
            width={window.WindowWidth * 0.45}
            height={50}></SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder style={{flexDirection: 'row'}}>
          <SkeletonPlaceholder.Item
            marginTop={20}
            marginBottom={20}
            borderRadius={10}
            marginLeft={5}
            // marginRight={10}
            width={window.WindowWidth * 0.45}
            height={50}></SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            marginTop={20}
            marginBottom={20}
            borderRadius={10}
            marginLeft={5}
            // marginRight={10}
            width={window.WindowWidth * 0.45}
            height={50}></SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
        {/* <SkeletonPlaceholder.Item
          marginTop={20}
          marginBottom={20}
          borderRadius={10}
          width={window.WindowWidth * 0.9}
          height={50}></SkeletonPlaceholder.Item> */}
        {/* <SkeletonPlaceholder.Item
          marginTop={20}
          marginBottom={20}
          borderRadius={10}
          width={window.WindowWidth * 0.9}
          height={50}></SkeletonPlaceholder.Item> */}
        {/* <SkeletonPlaceholder.Item
          marginTop={20}
          marginBottom={20}
          borderRadius={10}
          width={window.WindowWidth * 0.9}
          height={50}></SkeletonPlaceholder.Item> */}
        <SkeletonPlaceholder.Item
          marginTop={50}
          marginBottom={10}
          borderRadius={10}
          marginLeft={1}
          width={window.WindowWidth * 0.5}
          height={60}></SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default QuizSkeleton;