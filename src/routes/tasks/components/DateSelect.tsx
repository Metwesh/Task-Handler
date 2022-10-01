import { CSSObject } from "@emotion/serialize";
import * as chrono from "chrono-node";
import moment, { Moment } from "moment";
import { Component } from "react";
import "./DateSelect.css";

import Select, {
  components as SelectComponents,
  GroupProps,
  OptionProps,
} from "react-select";

interface DateOption {
  date: Moment;
  value: Date;
  label: string;
  display?: string;
}

const createOptionForDate = (d: Moment | Date) => {
  const date = moment.isMoment(d) ? d : moment(d);
  return {
    date,
    value: date.toDate(),
    label: date.calendar(null, {
      sameDay: "[Today] (Do MMM YYYY)",
      nextDay: "[Tomorrow] (Do MMM YYYY)",
      nextWeek: "[Next] dddd (Do MMM YYYY)",
      lastDay: "[Yesterday] (Do MMM YYYY)",
      lastWeek: "[Last] dddd (Do MMM YYYY)",
      sameElse: "Do MMMM YYYY",
    }),
  };
};

interface CalendarGroup {
  label: string;
  options: readonly DateOption[];
}

const defaultOptions: (DateOption | CalendarGroup)[] = [
  "today",
  "tomorrow",
].map((i) => createOptionForDate(chrono.parseDate(i)));

const createCalendarOptions = (date = new Date()) => {
  // const pages = Array.apply(null, { length: pdf.numPages });
  // const pages = { ...{ length: somePdf.numPages }};
  const daysInMonth = Array.apply(null, Array(moment(date).daysInMonth())).map(
    (_x, i) => {
      const d = moment(date).date(i + 1);
      return { ...createOptionForDate(d), display: "calendar" };
    }
  );
  return {
    label: moment(date).format("MMMM YYYY"),
    options: daysInMonth,
  };
};

defaultOptions.push(createCalendarOptions());

const suggestions = [
  "sunday",
  "saturday",
  "friday",
  "thursday",
  "wednesday",
  "tuesday",
  "monday",
  "december",
  "november",
  "october",
  "september",
  "august",
  "july",
  "june",
  "may",
  "april",
  "march",
  "february",
  "january",
  "yesterday",
  "tomorrow",
  "today",
].reduce<{ [key: string]: string }>((acc, str) => {
  for (let i = 1; i < str.length; i++) {
    acc[str.substring(0, i)] = str;
  }
  return acc;
}, {});

const suggest = (str: string) =>
  str
    .split(/\b/)
    .map((i) => suggestions[i] || i)
    .join("");

const days = ["S", "M", "T", "W", "T", "F", "S"];

const Group = (props: GroupProps<DateOption, false>) => {
  const {
    Heading,
    getStyles,
    children,
    label,
    headingProps,
    cx,
    theme,
    selectProps,
  } = props;
  return (
    // @ts-ignore-next-line
    <div style={getStyles("group", props)}>
      <Heading
        selectProps={selectProps}
        theme={theme}
        getStyles={getStyles}
        cx={cx}
        {...headingProps}
      >
        {label}
      </Heading>
      <div className="daysHeaderStyles">
        {days.map((day, i) => (
          <span key={`${i}-${day}`} className="daysHeaderItemStyles">
            {day}
          </span>
        ))}
      </div>
      <div className="daysContainerStyles">{children}</div>
    </div>
  );
};

const getOptionStyles = (defaultStyles: CSSObject): CSSObject => ({
  ...defaultStyles,
  display: "inline-block",
  width: "12%",
  margin: "0 1%",
  textAlign: "center",
  borderRadius: "4px",
});

const Option = (props: OptionProps<DateOption, false>) => {
  const { data, getStyles, innerRef, innerProps } = props;
  if (data.display === "calendar") {
    const defaultStyles = getStyles("option", props);
    const styles = getOptionStyles(defaultStyles);
    if (data.date.date() === 1) {
      const indentBy = data.date.day();
      if (indentBy) {
        styles.marginLeft = `${indentBy * 14 + 1}%`;
      }
    }
    return (
      // @ts-ignore-next-line
      <span {...innerProps} style={styles} ref={innerRef}>
        {data.date.format("D")}
      </span>
    );
  } else return <SelectComponents.Option {...props} />;
};

interface DatePickerProps {
  readonly value: DateOption | null;
  readonly onChange: (_value: DateOption | null) => void;
}

interface DatePickerState {
  readonly options: readonly (DateOption | CalendarGroup)[];
}

class DatePicker extends Component<DatePickerProps, DatePickerState> {
  state: DatePickerState = {
    options: defaultOptions,
  };
  handleInputChange = (value: string) => {
    if (!value) {
      this.setState({ options: defaultOptions });
      return;
    }
    const date = chrono.parseDate(suggest(value.toLowerCase()));
    if (date) {
      this.setState({
        options: [createOptionForDate(date), createCalendarOptions(date)],
      });
    } else {
      this.setState({
        options: [],
      });
    }
  };
  render() {
    const { value } = this.props;
    const { options } = this.state;
    return (
      <Select<DateOption, false>
        {...this.props}
        components={{ Group, Option }}
        filterOption={null}
        isMulti={false}
        isOptionSelected={(o, v) => v.some((i) => i.date.isSame(o.date, "day"))}
        maxMenuHeight={380}
        onChange={this.props.onChange}
        onInputChange={this.handleInputChange}
        options={options}
        name="deadline"
        classNamePrefix="select"
        value={value}
      />
    );
  }
}

interface State {
  readonly value: DateOption | null;
}

export default class DateSelect extends Component<
  Record<string, unknown>,
  State
> {
  state: State = {
    value: defaultOptions[0] as DateOption,
  };
  handleChange = (value: DateOption | null) => {
    this.setState({ value });
  };
  render() {
    const { value } = this.state;
    return (
      <div>
        <DatePicker value={value} onChange={this.handleChange} />
      </div>
    );
  }
}
