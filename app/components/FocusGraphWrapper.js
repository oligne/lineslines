import FocusGraph from './FocusGraph';
export default function FocusGraphWrapper(props) {
  const { onGraphUpdate, ...restProps } = props;

  return <FocusGraph onGraphUpdate={onGraphUpdate} {...restProps} />;
}
