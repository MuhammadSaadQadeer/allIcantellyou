import React, { useEffect, useState } from 'react';
import {Text} from 'react-native';
import moment from 'moment';
const Countdown = props => {
    const [days, setDays] = useState(undefined);
    const [hours, setHours] = useState(undefined);
    const [minutes, setMinutes] = useState(undefined);
    const [seconds, setSeconds] = useState(undefined);
    const { label } = props;
    useEffect(() => {
        const interval = setInterval(() => {
            const { timeTillDate, timeFormat } = props;
            const then = moment(timeTillDate, timeFormat);
            const now = moment();
            const diffTime = then - now;
            const duration = moment.duration(diffTime, 'milliseconds');

            setHours(duration.hours());
            setMinutes(duration.minutes());
            setSeconds(duration.seconds());

        }, 1000);
    }, []);
    return (
        <Text>
            {label} {hours}h {minutes}m {seconds}s
        </Text>
    )
};

export default Countdown;