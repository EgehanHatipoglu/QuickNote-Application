export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'Shopping' | 'List' | 'Health' | 'Other';
  createdAt: Date;
}

export type RootStackParamList = {
  Home:       undefined;
  AddNote:    undefined;
  EditNote:   { noteId: string };
  NoteDetail: { noteId: string };
};
