import { CSSObject } from "@emotion/serialize";
import * as chrono from "chrono-node";
import moment, { Moment } from "moment";
import { Component, CSSProperties } from "react";
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
  const daysInMonth = Array(...Array(moment(date).daysInMonth())).map(
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
    <div style={getStyles("group", props) as CSSProperties | undefined}>
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
      <span
        {...innerProps}
        style={styles as CSSProperties | undefined}
        ref={innerRef}
      >
        {data.date.format("D")}
      </span>
    );
  } else return <SelectComponents.Option {...props} />;
};

interface DatePickerProps {
  readonly value: DateOption | null;
  readonly onChange: (_value: DateOption | null) => void;
  readonly disabled?: boolean | unknown;
  readonly placement?: string | unknown;
  readonly error?: boolean | unknown;
  readonly initialValue?: Date | unknown;
  setDateErrors?: ((_arg: boolean) => void) | undefined;
}

interface DatePickerState {
  readonly options: readonly (DateOption | CalendarGroup)[];
  readonly disabled?: boolean | unknown;
  readonly placement?: string | unknown;
  readonly error?: boolean | unknown;
  readonly initialValue?: Date | unknown;
  setDateErrors?: ((_arg: boolean) => void) | undefined;
}

class DatePicker extends Component<DatePickerProps, DatePickerState> {
  constructor(props: DatePickerProps | Readonly<DatePickerProps>) {
    super(props);
  }
  state: DatePickerState = {
    options: defaultOptions,
  };
  handleInputChange = (value: string) => {
    this.props.setDateErrors?.(false);
    if (!value) {
      this.setState({
        options: this.props.initialValue
          ? [
              createOptionForDate(this.props.initialValue as Date),
              ...defaultOptions,
            ]
          : defaultOptions,
      });
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
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            neutral50: "#6c757d",
            text: "black",
            neutral20: this.props.error ? "#ff0000" : "#cccccc",
            primary25: "rgb(13, 202, 240, 0.4)",
            primary: "#0dcaf0",
          },
        })}
        components={{ Group, Option }}
        filterOption={null}
        isMulti={false}
        isDisabled={this.props.disabled ? true : false}
        isOptionSelected={(o, v) => v.some((i) => i.date.isSame(o.date, "day"))}
        maxMenuHeight={600}
        onChange={this.props.onChange}
        onInputChange={this.handleInputChange}
        options={options}
        placeholder="Select deadline"
        name="deadline"
        menuPlacement={`${this.props.placement === "top" ? "top" : "auto"}`}
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
  constructor(
    props: Record<string, unknown> | Readonly<Record<string, unknown>>
  ) {
    super(props);
  }
  state: State = {
    value: createOptionForDate(this.props.initialValue as Date) as DateOption,
  };
  handleChange = (value: DateOption | null) => {
    this.setState({ value });
  };
  render() {
    const { value } = this.state;
    return (
      <div>
        <DatePicker
          value={value}
          onChange={this.handleChange}
          disabled={this.props.disabled}
          initialValue={this.props.initialValue}
          placement={this.props.placement}
          error={this.props.error}
          setDateErrors={
            this.props.setDateErrors as ((_arg: boolean) => void) | undefined
          }
        />
      </div>
    );
  }
}
