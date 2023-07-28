import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useEffect, useState} from 'react';

const Demo = () => {
  const data = [
    {
      clinic_id: '1',
      pt_email: 'rajesh@wellkies.in',
      pt_fname: 'Rajesh ',
      pt_lname: 'S',
      pt_phone: '8144493035',
      visit_date: '2022-11-25',
      visit_time: '10:05',
    },
    {
      clinic_id: '1',
      pt_email: 'rajesh@wellkies.in',
      pt_fname: 'Rajesh ',
      pt_lname: 'S',
      pt_phone: '8144493035',
      visit_date: '2022-11-26',
      visit_time: '10:15',
    },

    {
      clinic_id: '1',
      pt_email: 'rajesh@wellkies.in',
      pt_fname: 'Rajesh ',
      pt_lname: 'S',
      pt_phone: '8144493035',
      visit_date: '2022-11-27',
      visit_time: '10:35',
    },
  ];
  const [list, setList] = useState(data);
  useEffect(() => {
    const newData = data.map(item => {
      // console.log(item.date);
      let cur_date = new Date().getTime();
      // console.log(cur_date, 'cur_date');
      let end_date = new Date(
        `${item.visit_date + 'T' + item.visit_time}`,
      ).getTime();
      // const end_time = new Date(
      //   `${list[0].visit_date + 'T' + list[0].visit_time}`,
      // ).getTime();
      // console.log(end_date, 'end_time');
      let remain_time = end_date - cur_date;
      // console.log(remain_time, 'remain_time');
      var days = Math.floor(remain_time / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (remain_time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      var minutes = Math.floor((remain_time % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((remain_time % (1000 * 60)) / 1000);
      // console.log(
      //   seconds,
      //   'seconds',
      //   minutes,
      //   'minutes',
      //   hours,
      //   'hours',
      //   days,
      //   'days',
      // );
      return {
        ...item,
        days_left: days,
        hours_left: hours,
        minutes_left: minutes,
        seconds_left: seconds,
      };
    });
    setList(newData);
    // const total = Date.parse(e) - Date.parse(new Date());
  }, [1000]);

  const getTimeRemaining = e => {};
  // console.log(data, 'data');
  return (
    <View>
      <FlatList
        data={list}
        renderItem={({item, index}) => (
          <View>
            <Text>
              {item.pt_fname}
              {item.visit_date}
              {/* {item.days_left} */}
            </Text>

            <Button
              onPress={() => getTimeRemaining()}
              title="GET TIME"></Button>
          </View>
        )}
      />
    </View>
  );
};

export default Demo;

const styles = StyleSheet.create({});
