import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingTop: 24,
  },
  items: {
    marginTop: 10,
    flex: 1,
  },
  item: {
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  scrollView: {
    flex: 1,
  },
});

export const formStyles = StyleSheet.create({
  formGroup: {
    marginBottom: 10,
  },
  header: {
    fontSize: 15,
    marginBottom: 4,
  },
  form: {
    margin: 12,
    padding: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  inputRadio: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    marginLeft: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
});
