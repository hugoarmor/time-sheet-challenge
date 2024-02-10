import { ObjectSerializer } from "../services/object_serializer";

export class PostBatidasSerializer extends ObjectSerializer<{
  momento: string;
  name: string;
}> {
  attributes = ["momento", "name"];

  name() {
    return "John Doe";
  }
}
