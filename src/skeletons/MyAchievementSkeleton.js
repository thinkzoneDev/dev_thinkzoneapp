import React from 'react';
import {Text, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const MyAchievementSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item>
        {/* <SkeletonPlaceholder.Item width={370} height={160} marginTop={12} marginLeft={12}  borderRadius={12}/> */}

        {/* <SkeletonPlaceholder.Item width={70} height={70} marginTop={12} marginLeft={12}  borderRadius={19}/> */}

        <SkeletonPlaceholder style={{flexDirection: 'row', marginTop: 19}}>
          <SkeletonPlaceholder.Item
            width={35}
            height={35}
            marginTop={12}
            marginLeft={19}
            borderRadius={30}
          />
          <SkeletonPlaceholder.Item
            width={50}
            height={10}
            paddingBottom={-39}
            paddingTop={-39}
            marginTop={25}
          />
          <SkeletonPlaceholder.Item
            width={35}
            height={35}
            marginTop={12}
            marginLeft={-5}
            borderRadius={30}
          />
          <SkeletonPlaceholder.Item
            width={50}
            height={10}
            paddingBottom={-39}
            paddingTop={-39}
            marginTop={25}
          />
          <SkeletonPlaceholder.Item
            width={35}
            height={35}
            marginTop={12}
            marginLeft={-3}
            borderRadius={30}
          />
          <SkeletonPlaceholder.Item
            width={50}
            height={10}
            paddingBottom={-39}
            paddingTop={-39}
            marginTop={25}
          />
          <SkeletonPlaceholder.Item
            width={35}
            height={35}
            marginTop={12}
            marginLeft={-3}
            borderRadius={30}
          />
          <SkeletonPlaceholder.Item
            width={50}
            height={10}
            paddingBottom={-39}
            paddingTop={-39}
            marginTop={25}
          />
          <SkeletonPlaceholder.Item
            width={35}
            height={35}
            marginTop={12}
            marginLeft={-3}
            borderRadius={30}
          />
        </SkeletonPlaceholder>
      </SkeletonPlaceholder.Item>

      {/* //For next skeleton */}
      <SkeletonPlaceholder.Item style={{marginTop: 19}}>
        <SkeletonPlaceholder.Item
          width={370}
          height={60}
          marginTop={12}
          marginLeft={12}
          borderRadius={12}
        />
      </SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={370}
          height={60}
          marginTop={12}
          marginLeft={12}
          borderRadius={12}
        />
      </SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={370}
          height={60}
          marginTop={12}
          marginLeft={12}
          borderRadius={12}
        />
      </SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={370}
          height={60}
          marginTop={12}
          marginLeft={12}
          borderRadius={12}
        />
      </SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={370}
          height={60}
          marginTop={12}
          marginLeft={12}
          borderRadius={12}
        />
      </SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={370}
          height={80}
          marginTop={12}
          marginLeft={12}
          borderRadius={12}
        />
      </SkeletonPlaceholder.Item>


{/* for time spent */}

      <SkeletonPlaceholder.Item style={{flexDirection:"row"}}>
        <SkeletonPlaceholder.Item
          width={100}
          height={260}
          marginTop={12}
          marginLeft={59}
          borderRadius={12}
        />

        <SkeletonPlaceholder.Item
          width={100}
          height={260}
          marginTop={12}
          marginLeft={89}
          borderRadius={12}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default MyAchievementSkeleton;
