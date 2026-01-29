import { Alert } from "react-native";

export function toastSuccess(title: string, message?: string) {
  Alert.alert(title, message);
}

export function toastError(title: string, message?: string) {
  Alert.alert(title, message);
}
