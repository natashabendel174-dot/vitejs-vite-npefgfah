import { useState, useRef } from "react";

const MUSCLE_GROUPS: string[] = ["Ноги","Груди","Спина","Плечі","Біцепс","Трицепс","Прес","Сідниці","Кардіо"];
const MONTH_NAMES: string[] = ["Січня","Лютого","Березня","Квітня","Травня","Червня","Липня","Серпня","Вересня","Жовтня","Листопада","Грудня"];
const MOODS: string[] = ["😴","🙂","💪","🔥","⚡"];

interface Exercise {
  id: string; name: string; sets: number; reps: number; weight: number; group: string; note: string;
}
interface Workout {
  id: string; date: string; name: string; mood: string; exercises: Exercise[];
}

const genId = (): string => Math.random().toString(36).slice(2);
const today = (): string => new Date().toISOString().slice(0, 10);
const formatDate = (iso: string): string => {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
};
const W = (date: string, name: string, mood: string, exercises: Omit<Exercise,"id">[]): Workout => ({
  id: genId(), date, name, mood, exercises: exercises.map((e) => ({ ...e, id: genId() }))
});
const E = (name: string, sets: number, reps: number, weight: number, group: string, note = ""): Omit<Exercise,"id"> => ({
  name, sets, reps, weight, group, note
});

const PLAN_WORKOUTS: Workout[] = [
  W("2026-05-26","Верх: Груди + Спина + Плечі","💪",[
    E("Жим гантелей лежачи",4,12,12,"Груди","6+6 кг — контроль опускання"),
    E("Розведення гантелей лежачи",3,15,6,"Груди","3+3 кг — пауза внизу"),
    E("Пуловер лежачи з гантеллю",3,12,10,"Спина","Розтяжка грудей і спини"),
    E("Тяга верхнього блока до грудей",4,12,25,"Спина","Лопатки вниз-назад"),
    E("Горизонтальна тяга в тренажері",3,12,25,"Спина","Суперсет з жимом Арнольда"),
    E("Жим Арнольда",3,12,6,"Плечі","3+3 кг — суперсет"),
    E("Розведення гантелей в сторони",3,15,3,"Плечі","Дроп-сет: 3→2→1 кг"),
    E("Face pull — тяга каната на трапецію",3,15,15,"Плечі","Лікті вище плечей"),
    E("Прес — велосипед",3,20,0,"Прес",""),
  ]),
  W("2026-05-27","Низ: Сідниці + Ноги","🔥",[
    E("Жим платформи (ноги вище і ширше)",4,15,60,"Сідниці","Пята тисне в платформу"),
    E("Румунська тяга з гантелями",4,12,28,"Сідниці","14+14 кг — відчуй розтяжку"),
    E("Розгинання ніг в тренажері",3,15,15,"Ноги","Суперсет з румунською"),
    E("Згинання ніг в тренажері",3,15,25,"Ноги",""),
    E("Випади ножниці з гантелями",3,12,20,"Ноги","10+10 кг"),
    E("Розведення ніг в тренажері",3,20,30,"Сідниці","Вгорі затримка 1 сек"),
    E("Зведення ніг в тренажері",3,20,25,"Ноги",""),
    E("Ягодичний міст з вагою",3,15,20,"Сідниці","Резинка вище колін"),
    E("Прес — скручування",3,20,0,"Прес",""),
  ]),
  W("2026-05-29","Верх: Спина + Плечі + Руки","⚡",[
    E("Підтягування в гравітроні",4,12,55,"Спина","Широкий хват"),
    E("Тяга в ричажному тренажері однією рукою",3,12,15,"Спина","По черзі, 7.5+7.5 кг"),
    E("Тяга нижнього блока сидячи",3,12,20,"Спина","Вузький хват"),
    E("Тяга каната за голову",3,15,20,"Спина","Суперсет з жимом грифа"),
    E("Жим грифа з-за голови",3,15,5,"Плечі","Суперсет"),
    E("Підйом гантелей перед собою",3,12,4,"Плечі","2+2 кг"),
    E("Тяга канатної рукояті на біцепс",3,12,15,"Біцепс",""),
    E("Розгинання на трицепс з канатом",3,15,10,"Трицепс",""),
    E("Прес — підйом ніг",3,15,0,"Прес",""),
  ]),
  W("2026-05-30","Низ: Ноги + Сідниці акцент квадрицепс","🔥",[
    E("Присідання в тренажері Сміта",4,12,45,"Ноги","Носки трохи назовні"),
    E("Жим однією ногою в гравітроні",3,15,55,"Ноги","По черзі — баланс"),
    E("Болгарські випади з гантелями",3,10,10,"Ноги","5+5 кг по черзі"),
    E("Зашагування на платформу з гантелями",3,12,8,"Ноги","4+4 кг"),
    E("Гіперекстензія (акцент на сідниці)",3,15,0,"Сідниці","Вгорі зажати сідниці"),
    E("Відведення ноги в кросовері назад",3,20,15,"Сідниці","По черзі"),
    E("Розведення ніг в тренажері",3,20,25,"Сідниці",""),
    E("Прес — планка",3,45,0,"Прес","45 секунд"),
  ]),
];

const ARCHIVE_WORKOUTS: Workout[] = [
  W("2026-04-20","Спина + плечі","💪",[
    E("Жим гантелей лежачи",3,12,12,"Груди","6+6 кг"),
    E("Розведення гантелей лежачи",3,12,6,"Груди","3+3 кг"),
    E("Пуловер лежачи",3,12,7,"Спина"),
    E("Тяга верхнього блока вузьким хватом",3,12,20,"Спина","Суперсет"),
    E("Жим гантелей з-за голови",3,12,4,"Плечі","Суперсет"),
    E("Підйом гантелей перед собою",3,12,4,"Плечі","2+2 кг"),
    E("Тяга верхнього блока однією рукою в кросовері",3,12,7,"Спина"),
  ]),
  W("2026-04-15","Ноги + сідниці","🔥",[
    E("Жим платформи",3,12,50,"Сідниці"),
    E("Розгинання ніг в тренажері",3,15,10,"Ноги","Суперсет з румунською"),
    E("Румунська тяга",3,15,28,"Сідниці","14+14 кг"),
    E("Згинання ніг в тренажері",3,15,25,"Ноги"),
    E("Випади ножниці",3,12,20,"Ноги","10+10 кг"),
    E("Розведення ніг в тренажері",3,15,30,"Сідниці"),
    E("Зведення ніг в тренажері",3,15,30,"Ноги"),
  ]),
  W("2026-04-12","Спина + руки","💪",[
    E("Тяга верхнього блока до грудей",3,12,25,"Спина"),
    E("Горизонтальна тяга в тренажері",3,12,25,"Спина"),
    E("Тяга нижнього блока в нахилі",3,12,15,"Спина"),
    E("Пуловер в тренажері",3,12,15,"Спина"),
    E("Face pull — тяга каната на трапецію",3,12,15,"Спина"),
    E("Тяга канатної рукояті на біцепс",3,12,15,"Біцепс"),
    E("Розгинання рук з-за голови на трицепс",3,12,7,"Трицепс"),
  ]),
  W("2026-04-07","Плечі + спина","⚡",[
    E("Жим Арнольда",3,12,6,"Плечі","Суперсет зі зведенням"),
    E("Зведення в метелику",3,15,15,"Груди","Суперсет"),
    E("Тяга вузьким хватом",3,12,25,"Спина"),
    E("Жим гантелей з-за голови",3,12,4,"Плечі"),
    E("Горизонтальна тяга",3,12,25,"Спина"),
    E("Тяга в ричажному тренажері однією рукою",3,12,10,"Спина"),
    E("Розведення в сторони дроп-сет",3,12,3,"Плечі","Дроп-сет: 3→4→3 кг"),
  ]),
  W("2026-04-01","Ноги + сідниці","🔥",[
    E("Жим платформи",3,15,50,"Сідниці"),
    E("Румунська тяга",3,15,24,"Сідниці","12+12 кг"),
    E("Згинання ніг лежачи",3,15,25,"Ноги"),
    E("Розводка ніг в тренажері",3,15,30,"Сідниці"),
    E("Випади ножниці або крокуючи",3,12,24,"Ноги","12+12 кг"),
    E("Розгинання ніг в тренажері",3,15,10,"Ноги"),
    E("Ягодичний мостик",3,15,0,"Сідниці"),
  ]),
  W("2026-03-25","Руки + спина","💪",[
    E("Тяга нижнього блока в нахилі",3,12,15,"Спина"),
    E("Пуловер",3,12,15,"Спина"),
    E("Тяга верхнього блока до грудей",3,12,25,"Спина"),
    E("Горизонтальна тяга в тренажері",3,12,25,"Спина"),
    E("Тяга канатного блока на трапецію",3,12,15,"Спина"),
    E("Тяга канатної рукояті на біцепс",3,12,15,"Біцепс","Суперсет"),
    E("Розгинання з-за голови на трицепс",3,12,7,"Трицепс","Суперсет"),
  ]),
  W("2026-03-20","Сідниці","🔥",[
    E("Жим платформи ноги вище і ширше",3,12,50,"Сідниці"),
    E("Румунська тяга",3,12,25,"Сідниці"),
    E("Розгинання ніг в тренажері",3,12,15,"Ноги"),
    E("Згинання ніг в тренажері",3,12,10,"Ноги"),
    E("Випади ножниці з гантелями",3,10,16,"Ноги","8+8 кг"),
    E("Розведення ніг в тренажері",3,15,25,"Сідниці"),
    E("Зведення ніг в тренажері",3,15,30,"Ноги"),
  ]),
  W("2026-01-23","Спина + плечі","💪",[
    E("Тяга горизонтального блока",3,12,25,"Спина"),
    E("Тяга однією рукою в тренажері",3,12,15,"Спина"),
    E("Пуловер з гантеллю лежачи",3,12,12,"Спина"),
    E("Жим Арнольда легкий",3,12,6,"Плечі"),
    E("Махи гантелями в сторону",2,15,3,"Плечі"),
    E("Біцепс + трицепс суперсет",3,12,15,"Біцепс","Суперсет"),
  ]),
  W("2026-01-21","Ноги та сідниці","🔥",[
    E("Присідання в тренажері Сміта",4,11,20,"Ноги"),
    E("Випади назад з гантелями",3,11,10,"Ноги","5+5 кг"),
    E("Румунська тяга з гантелями",3,12,20,"Сідниці","10+10 кг"),
    E("Махи ногами назад в кросовері",3,17,15,"Сідниці"),
    E("Гіперекстензія без ваги",3,15,0,"Спина","Вгорі зажати сідниці"),
    E("Прес скручування",2,15,0,"Прес"),
  ]),
  W("2026-01-19","Спина основа постави","💪",[
    E("Тяга верхнього блока до грудей",3,13,25,"Спина"),
    E("Тяга гантелі в нахилі одна рука",3,13,9,"Спина","Пауза 1 сек вгорі"),
    E("Розводка гантелей стоячи 2+2",3,15,3,"Плечі","Маленька вага"),
    E("Жим Арнольда",3,13,4,"Плечі"),
    E("Розгинання рук з канатом верхній блок",3,17,10,"Трицепс","Суперсет"),
    E("Згинання рук в тренажері",2,13,10,"Біцепс","Суперсет"),
    E("Горизонтальна тяга",3,12,15,"Спина"),
    E("Прес велосипед",2,15,0,"Прес"),
  ]),
  // ── АРХІВ 2019–2021 ──
  W("2021-02-03","Архів — Спина + Ноги + Плечі","💪",[
    E("Тяга верхнього блока",3,15,20,"Спина","+ лат.відведення 2+2"),
    E("Тяга нижнього блока до поясу сидячи",3,15,20,"Спина","+ кувшинчики 2+2"),
    E("Розгинання на трицепс",3,16,10,"Трицепс","+ румунська 14+14"),
    E("Випади проходка з гантелями",3,15,8,"Ноги","8+8 кг"),
    E("Згинання лежачи",3,15,20,"Ноги"),
    E("Зашагування на платформу",3,15,5,"Ноги","5+5 кг"),
    E("Болгарські випади",3,15,0,"Ноги"),
    E("Присід сумо",3,15,22,"Ноги"),
  ]),
  W("2021-01-22","Архів — Ноги акцент сідниці","🔥",[
    E("Розгинання + розводка в присіді з резинкою",3,15,40,"Сідниці"),
    E("Жим платформи з резинкою пятою",3,15,80,"Сідниці"),
    E("Жим в гравітроні по одній нозі",3,15,55,"Ноги"),
    E("Розгинання лежа + гуд морнінг",3,15,0,"Спина"),
    E("Згинання сидячи по одній нозі",3,30,10,"Ноги","По черзі"),
    E("Зведення",3,15,25,"Ноги"),
  ]),
  W("2021-01-21","Архів — Спина об'єм","💪",[
    E("Тяга в гравітроні",3,15,55,"Спина"),
    E("Тяга в нахилі до поясу нейтральним хватом",3,15,20,"Спина"),
    E("Пуловер + жим за голови + підйом з прокручуванням",3,15,15,"Спина","Трисет"),
    E("Тяга в ричажному тренажері по черзі",3,15,5,"Спина","5+5 кг + тяга з опорою 12 кг"),
    E("Тяга верхнього блока сидячи",3,15,5,"Спина","Трисет"),
    E("Тяга нижнього блока до поясу",3,15,15,"Спина"),
    E("Біцепс",3,15,10,"Біцепс"),
  ]),
  W("2021-01-20","Архів — Ноги повний","🔥",[
    E("Жим по одній нозі в гравітроні",3,15,55,"Ноги"),
    E("Присідання сумо + румунська в тренажері",3,15,22,"Ноги","Суперсет"),
    E("Жим платформи лежа по одній нозі боком",3,15,60,"Сідниці"),
    E("Випади на місці по черзі + розгинання",3,15,10,"Ноги","10+10 кг"),
    E("Розводка",3,15,30,"Сідниці"),
    E("Зведення",3,15,20,"Ноги"),
  ]),
  W("2020-11-26","Архів — Спина + Плечі","💪",[
    E("Підтягування в гравітроні",3,15,55,"Спина"),
    E("Тяга в ричажному тренажері по черзі",3,15,15,"Спина"),
    E("Тяга в нахилі",3,15,8,"Спина"),
    E("Жим Арнольда + зведення в метелику",3,15,3,"Плечі","Суперсет 3+3 кг"),
    E("Тяга каната за голову + жим грифа",3,15,25,"Спина","Суперсет"),
    E("Тяга + розводка гантелей",3,15,15,"Спина","Суперсет 3+3 кг"),
  ]),
  W("2020-11-21","Архів — Ноги + сідниці","🔥",[
    E("Жим однією ногою в гравітроні + болгарські випади",3,15,55,"Ноги"),
    E("Присідання в Сміті з резинкою",3,15,0,"Ноги"),
    E("Плié + розводка в тренажері",3,15,12,"Ноги","Суперсет 25 кг"),
    E("Жим платформи по одній нозі",3,15,40,"Сідниці"),
  ]),
  W("2020-11-20","Архів — Спина тяги","💪",[
    E("Підтягування в гравітроні",3,15,50,"Спина"),
    E("Тяга в ричажному тренажері",4,15,15,"Спина"),
    E("Тяга гантелей в нахилі однією рукою",3,10,10,"Спина"),
    E("Жим грифа з-за голови + розводка",3,15,5,"Плечі","Суперсет 2+2 кг"),
    E("Розводка + жим вперед",3,15,2,"Плечі","2+2 кг"),
    E("V-подібний жим",3,15,1,"Плечі","1+1 кг"),
  ]),
  W("2020-11-18","Архів — Ноги функціональні","🔥",[
    E("Жим в гравітроні однією ногою",3,15,50,"Ноги"),
    E("Почергові випади з гантелями жим вверх",3,15,5,"Ноги","5+5 кг"),
    E("Проходка з жимами вверх",3,13,4,"Плечі","4+4 кг"),
    E("Обернена екстензія на сідницю",3,15,0,"Сідниці"),
    E("Розгинання на квадрицепс по черзі",3,20,5,"Ноги"),
  ]),
  W("2020-11-15","Архів — Ноги об'єм","🔥",[
    E("Жим платформи однією ногою по черзі",3,15,35,"Сідниці"),
    E("Розгинання в тренажері лежачи + румунська",3,15,25,"Ноги","Суперсет"),
    E("Зашагування на платформу по черзі",3,15,4,"Ноги","4+4 кг"),
    E("Розводка + зведення в тренажері",3,15,15,"Сідниці","Суперсет 20 кг"),
  ]),
  W("2020-11-14","Архів — Спина + руки","💪",[
    E("Підтягування в гравітроні",3,15,55,"Спина"),
    E("Тяга нижнього блока стоячи + пуловер",3,15,10,"Спина","Суперсет 20 кг"),
    E("Тяга канатної рукояті за голову + розводка жим",3,15,15,"Спина","Суперсет 3+3 кг"),
    E("Горизонтальна тяга",3,15,15,"Спина"),
    E("Розгинання на біцепс + трицепс",3,15,10,"Біцепс","Суперсет"),
  ]),
  W("2020-10-23","Архів — Ноги","🔥",[
    E("Жим платформи",4,15,60,"Сідниці"),
    E("Розгинання + румунська",3,15,10,"Ноги","Суперсет 8+8 кг"),
    E("Згинання в тренажері",3,15,10,"Ноги"),
    E("Випади ножниці",3,15,8,"Ноги","8+8 кг"),
    E("Розводка в тренажері",3,20,25,"Сідниці"),
    E("Зведення в тренажері",3,15,15,"Ноги"),
  ]),
  W("2020-10-22","Архів — Спина + плечі","💪",[
    E("Тяга нижнього блока в нахилі",3,15,15,"Спина"),
    E("Пуловер",3,20,10,"Спина"),
    E("Тяга за голову на коліна",3,20,30,"Спина"),
    E("Горизонтальна тяга в тренажері",3,20,15,"Спина"),
    E("Тяга канатного блока на трапецію",3,20,15,"Плечі"),
    E("Тяга канатної рукояті на біцепс + розгинання з-за голови",3,20,10,"Біцепс","Суперсет"),
  ]),
  W("2019-11-07","Архів 2019 — Спина широка","💪",[
    E("Підтягування в гравітроні",3,15,55,"Спина"),
    E("Тяга гантелей в нахилі однією рукою",3,15,8,"Спина"),
    E("Тяга в ричажному тренажері широким хватом",3,15,10,"Спина","10+10 кг"),
    E("Тяга за голову канатом + жим за голови",3,15,30,"Спина","Суперсет гриф"),
    E("Тяга верхнього блока до грудей + розводка",3,15,20,"Спина","Суперсет 2+2 кг"),
    E("Тяга на задню дельту кругла спина",3,15,3,"Плечі"),
    E("Гіперекстензія",3,15,0,"Спина"),
  ]),
  W("2019-10-07","Архів 2019 — Ноги баланс","🔥",[
    E("Жим платформи",4,12,0,"Сідниці"),
    E("Зашагування на платформу з гантелями",3,15,5,"Ноги","5+5 кг"),
    E("Жим однією ногою в гравітроні",3,15,55,"Ноги"),
    E("Румунська тяга",3,12,0,"Сідниці"),
    E("Махи ногою назад на лавці",3,20,0,"Сідниці"),
    E("Махи ногою в сторону на лавці",3,20,0,"Сідниці"),
  ]),
  W("2019-09-10","Архів 2019 — Ноги та сідниці","🔥",[
    E("Румунська тяга в тренажері Сміта",3,20,30,"Сідниці"),
    E("Діагональні випади в тренажері Сміта + жим ноги в гравітроні",3,15,0,"Ноги","Суперсет"),
    E("Проходка з гантелями",3,15,8,"Ноги","8+8 кг"),
    E("Відведення і приведення ноги в кросовері",3,15,0,"Сідниці"),
  ]),
  W("2019-09-09","Архів 2019 — Спина + плечі + руки","💪",[
    E("Тяга в ричажному тренажері + розводка гантелей стоячи",3,15,15,"Спина","Суперсет 2+2 кг"),
    E("Тяга гантелей в нахилі однією рукою",3,15,6,"Спина"),
    E("Тяга верхнього блока сидячи до грудей",3,15,20,"Спина"),
    E("Тяга канатної рукояті на трапецію",3,12,20,"Плечі"),
    E("Розгинання канатної рукояті + згинання на біцепс",3,13,10,"Трицепс","Суперсет"),
  ]),
];

const ALL_WORKOUTS = [...PLAN_WORKOUTS, ...ARCHIVE_WORKOUTS];

const blankExercise = (): Exercise => ({ id: genId(), name: "", sets: 3, reps: 12, weight: 0, group: "Спина", note: "" });

export default function WorkoutTracker() {
  const [workouts, setWorkouts] = useState<Workout[]>(ALL_WORKOUTS);
  const [view, setView] = useState<"log" | "detail" | "add" | "edit">("log");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterGroup, setFilterGroup] = useState("Всі");
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [lastDoneId, setLastDoneId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Workout,"id">>({
    date: today(), name: "", mood: "💪",
    exercises: [blankExercise()]
  });

  // drag state
  const dragIdx = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const goBack = () => {
    setView("log");
    setTimeout(() => {
      if (selectedId && cardRefs.current[selectedId]) {
        cardRefs.current[selectedId]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 80);
  };

  const sorted = [...workouts].sort((a, b) => b.date.localeCompare(a.date));
  const filtered = filterGroup === "Всі" ? sorted : sorted.filter((w) => w.exercises.some((e) => e.group === filterGroup));
  const selected = workouts.find((w) => w.id === selectedId);

  const totalSets = (w: Workout): number => w.exercises.reduce((s, e) => s + Number(e.sets), 0);
  const totalVolume = (w: Workout): number => w.exercises.reduce((s, e) => s + Number(e.sets) * Number(e.reps) * Number(e.weight), 0);

  // ── FORM helpers ──
  const addExRow = () => setForm((f) => ({ ...f, exercises: [...f.exercises, blankExercise()] }));
  const removeExRow = (id: string) => setForm((f) => ({ ...f, exercises: f.exercises.filter((e) => e.id !== id) }));
  const updateExRow = (id: string, field: keyof Exercise, val: string) =>
    setForm((f) => ({ ...f, exercises: f.exercises.map((e) => e.id === id ? { ...e, [field]: val } : e) }));

  const saveNew = () => {
    if (!form.name.trim() || form.exercises.length === 0) return;
    setWorkouts((ws) => [...ws, { ...form, id: genId() }]);
    setForm({ date: today(), name: "", mood: "💪", exercises: [blankExercise()] });
    setView("log");
  };

  // ── EDIT helpers ──
  const startEdit = (w: Workout, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingWorkout({ ...w, exercises: w.exercises.map((ex) => ({ ...ex })) });
    setView("edit");
  };
  const addEditExRow = () => setEditingWorkout((w) => w ? { ...w, exercises: [...w.exercises, blankExercise()] } : w);
  const removeEditExRow = (id: string) => setEditingWorkout((w) => w ? { ...w, exercises: w.exercises.filter((e) => e.id !== id) } : w);
  const updateEditExRow = (id: string, field: keyof Exercise, val: string) =>
    setEditingWorkout((w) => w ? { ...w, exercises: w.exercises.map((e) => e.id === id ? { ...e, [field]: val } : e) } : w);
  const saveEdit = () => {
    if (!editingWorkout) return;
    setWorkouts((ws) => ws.map((w) => w.id === editingWorkout.id ? editingWorkout : w));
    setView("log");
  };

  const deleteWorkout = (id: string) => {
    setWorkouts((ws) => ws.filter((w) => w.id !== id));
    if (selectedId === id) { setSelectedId(null); setView("log"); }
  };

  // ── DRAG helpers ──
  const onDragStart = (i: number) => { dragIdx.current = i; };
  const onDragEnter = (i: number) => { dragOver.current = i; };
  const onDragEnd = () => {
    if (dragIdx.current === null || dragOver.current === null) return;
    const copy = [...filtered];
    const [moved] = copy.splice(dragIdx.current, 1);
    copy.splice(dragOver.current, 0, moved);
    const ids = copy.map((w) => w.id);
    setWorkouts((ws) => {
      const map: Record<string, Workout> = {};
      ws.forEach((w) => { map[w.id] = w; });
      const reordered = ids.map((id) => map[id]).filter(Boolean) as Workout[];
      const rest = ws.filter((w) => !ids.includes(w.id));
      return [...reordered, ...rest];
    });
    dragIdx.current = null;
    dragOver.current = null;
  };

  const ExerciseFormRows = ({
    exercises,
    onUpdate,
    onRemove,
    onAdd,
  }: {
    exercises: Exercise[];
    onUpdate: (id: string, field: keyof Exercise, val: string) => void;
    onRemove: (id: string) => void;
    onAdd: () => void;
  }) => (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {exercises.map((ex, i) => (
          <div key={ex.id} style={{ background: "#13131a", border: "1px solid #1e1e28", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: "#555", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: ".1em" }}>ВПРАВА {i + 1}</span>
              <button className="delete-btn" onClick={() => onRemove(ex.id)}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <input placeholder="Назва вправи" value={ex.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(ex.id, "name", e.target.value)} />
              <select value={ex.group} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onUpdate(ex.id, "group", e.target.value)}>
                {MUSCLE_GROUPS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
              {(["sets", "reps", "weight"] as (keyof Exercise)[]).map((field, idx) => (
                <div key={field}>
                  <div style={{ fontSize: 10, color: "#444", marginBottom: 5, letterSpacing: ".07em" }}>{["ПІДХОДИ","ПОВТОРИ","ВАГА (КГ)"][idx]}</div>
                  <input type="number" min={0} value={ex[field] as number} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(ex.id, field, e.target.value)} />
                </div>
              ))}
            </div>
            <input placeholder="Нотатка (суперсет, техніка...)" value={ex.note} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(ex.id, "note", e.target.value)} />
          </div>
        ))}
      </div>
      <button className="btn-ghost" onClick={onAdd} style={{ width: "100%", marginBottom: 16, padding: "12px" }}>+ Додати вправу</button>
    </>
  );

  return (
    <div style={{ fontFamily: "'DM Mono','Courier New',monospace", background: "#0d0d0f", minHeight: "100vh", color: "#e8e4dc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0d0d0f}::-webkit-scrollbar-thumb{background:#3a3a40;border-radius:2px}
        input,select,textarea{background:#18181c!important;color:#e8e4dc!important;border:1px solid #2e2e36!important;border-radius:6px!important;padding:8px 10px!important;font-family:'DM Mono',monospace!important;font-size:13px!important;outline:none!important;transition:border-color .2s;width:100%}
        input:focus,select:focus,textarea:focus{border-color:#c8ff00!important}
        select option{background:#18181c}
        .btn-primary{background:#c8ff00;color:#0d0d0f;border:none;border-radius:6px;padding:10px 22px;font-family:'DM Mono',monospace;font-size:13px;font-weight:500;cursor:pointer;letter-spacing:.04em;transition:opacity .15s,transform .1s}
        .btn-primary:hover{opacity:.88;transform:translateY(-1px)}
        .btn-ghost{background:transparent;color:#888;border:1px solid #2e2e36;border-radius:6px;padding:9px 18px;font-family:'DM Mono',monospace;font-size:12px;cursor:pointer;transition:border-color .2s,color .2s}
        .btn-ghost:hover{border-color:#888;color:#e8e4dc}
        .btn-edit{background:transparent;border:1px solid #2e2e36;color:#888;cursor:pointer;font-size:13px;padding:4px 8px;border-radius:4px;transition:color .15s,border-color .15s;line-height:1}
        .btn-edit:hover{color:#c8ff00;border-color:#c8ff0066}
        .tag{display:inline-block;background:#1e1e24;color:#888;font-size:11px;padding:3px 8px;border-radius:4px;border:1px solid #2e2e36}
        .tag.active{background:#c8ff001a;color:#c8ff00;border-color:#c8ff0044}
        .workout-card{background:#13131a;border:1px solid #1e1e28;border-radius:12px;padding:18px 20px;cursor:pointer;transition:border-color .2s,transform .15s;position:relative;overflow:hidden}
        .workout-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:#c8ff00;border-radius:3px 0 0 3px;opacity:0;transition:opacity .2s}
        .workout-card:hover{border-color:#c8ff0033;transform:translateY(-2px)}
        .workout-card:hover::before{opacity:1}
        .done-card{border-color:#c8ff0055!important;background:#0f1a00!important}
        .done-card::before{opacity:1!important}
        .delete-btn{background:transparent;border:none;color:#444;cursor:pointer;font-size:16px;padding:4px 6px;border-radius:4px;transition:color .15s,background .15s;line-height:1}
        .delete-btn:hover{color:#ff4d4d;background:#ff4d4d18}
        .stat-box{background:#18181c;border:1px solid #2e2e36;border-radius:8px;padding:12px 16px;text-align:center}
        .nav-btn{background:transparent;border:none;color:#555;font-family:'DM Mono',monospace;font-size:12px;cursor:pointer;padding:8px 16px;border-radius:6px;letter-spacing:.05em;transition:color .15s,background .15s}
        .nav-btn.active{color:#c8ff00;background:#c8ff0014}
        .nav-btn:hover:not(.active){color:#e8e4dc}
        .mood-btn{background:#18181c;border:1px solid #2e2e36;border-radius:6px;padding:6px 10px;cursor:pointer;font-size:18px;transition:border-color .15s,transform .1s}
        .mood-btn.selected{border-color:#c8ff00;transform:scale(1.15)}
        .mood-btn:hover{border-color:#555}
        .section-title{font-family:'Bebas Neue',sans-serif;letter-spacing:.12em;font-size:11px;color:#555;text-transform:uppercase;margin-bottom:10px}
        .drag-card{cursor:grab;user-select:none}
        .drag-card:active{cursor:grabbing}
        .fade-in{animation:fadeIn .3s ease}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
      `}</style>

      {/* HEADER */}
      <div style={{ padding: "28px 24px 0", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, letterSpacing: ".08em", lineHeight: 1 }}>
              WORKOUT<span style={{ color: "#c8ff00" }}>.</span>LOG
            </div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{workouts.length} тренувань записано</div>
          </div>
          <button className="btn-primary" onClick={() => setView("add")} style={{ marginBottom: 4 }}>+ Нове</button>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 20, borderBottom: "1px solid #1e1e28" }}>
          <button className={`nav-btn ${view === "log" ? "active" : ""}`} onClick={() => setView("log")}>ЖУРНАЛ</button>
          {selected && <button className={`nav-btn ${view === "detail" ? "active" : ""}`} onClick={() => setView("detail")}>ДЕТАЛІ</button>}
          {view === "add" && <button className="nav-btn active">НОВИЙ</button>}
          {view === "edit" && <button className="nav-btn active">РЕДАГУВАННЯ</button>}
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 24px 40px" }}>

        {/* ── LOG ── */}
        {view === "log" && (
          <div className="fade-in">
            {/* filters */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
              {["Всі", ...MUSCLE_GROUPS].map((g) => (
                <button key={g} className={`tag ${filterGroup === g ? "active" : ""}`}
                  style={{ cursor: "pointer", border: "none", fontFamily: "'DM Mono',monospace", fontSize: 11 }}
                  onClick={() => setFilterGroup(g)}>{g}</button>
              ))}
            </div>

            {/* stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
              {([
                [workouts.length, "ТРЕНУВАНЬ"],
                [workouts.reduce((s, w) => s + w.exercises.length, 0), "ВПРАВ"],
                [Math.round(workouts.reduce((s, w) => s + totalVolume(w), 0) / 1000) + "к", "КГ ОБСЯГ"],
              ] as [string | number, string][]).map(([val, label]) => (
                <div key={label} className="stat-box">
                  <div style={{ fontSize: 22, fontFamily: "'Bebas Neue',sans-serif", color: "#c8ff00", letterSpacing: ".06em" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 11, color: "#555", marginBottom: 12 }}>↕ Перетягуй картки щоб змінити порядок</div>

            {/* cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map((w, i) => {
                const isDone = lastDoneId === w.id;
                return (
                  <div
                    key={w.id}
                    ref={(el) => { cardRefs.current[w.id] = el; }}
                    className={`workout-card drag-card ${isDone ? "done-card" : ""}`}
                    draggable
                    onDragStart={() => onDragStart(i)}
                    onDragEnter={() => onDragEnter(i)}
                    onDragEnd={onDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => { setSelectedId(w.id); setView("detail"); }}
                  >
                    {isDone && (
                      <div style={{ position: "absolute", top: 10, right: 48, fontSize: 11, color: "#c8ff00", background: "#c8ff0018", border: "1px solid #c8ff0044", borderRadius: 4, padding: "2px 8px", letterSpacing: ".06em", fontFamily: "'Bebas Neue',sans-serif" }}>
                        ✓ ТУТ ЗУПИНИЛАСЬ
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 20 }}>{w.mood}</span>
                          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: ".06em", color: isDone ? "#c8ff00" : "#ffffff" }}>{w.name}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
                          {formatDate(w.date)} &nbsp;·&nbsp; {w.exercises.length} вправ &nbsp;·&nbsp; {totalSets(w)} підходів
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: isDone ? 20 : 0 }}>
                        <div style={{ fontSize: 11, color: "#c8ff00", fontFamily: "'Bebas Neue',sans-serif" }}>
                          {totalVolume(w) > 0 ? `${totalVolume(w).toLocaleString()} кг` : "—"}
                        </div>
                        <button
                          title="Відмітити — тут зупинилась"
                          style={{ background: isDone ? "#c8ff0022" : "transparent", border: `1px solid ${isDone ? "#c8ff00" : "#2e2e36"}`, color: isDone ? "#c8ff00" : "#555", cursor: "pointer", fontSize: 14, padding: "4px 7px", borderRadius: 4, transition: "all .15s", lineHeight: 1 }}
                          onClick={(e) => { e.stopPropagation(); setLastDoneId(isDone ? null : w.id); }}>
                          {isDone ? "✓" : "○"}
                        </button>
                        <button className="btn-edit" onClick={(e) => startEdit(w, e)}>✏️</button>
                        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteWorkout(w.id); }}>✕</button>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                      {[...new Set(w.exercises.map((e) => e.group))].map((g) => (
                        <span key={g} className="tag">{g}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DETAIL ── */}
        {view === "detail" && selected && (
          <div className="fade-in">
            <button className="btn-ghost" onClick={() => goBack()} style={{ marginBottom: 16, fontSize: 13 }}>← Назад</button>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>{selected.mood}</span>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: ".06em" }}>{selected.name}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>{formatDate(selected.date)}</div>
                </div>
              </div>
              <button className="btn-edit" style={{ fontSize: 14, padding: "6px 12px" }} onClick={(e) => startEdit(selected, e)}>✏️ Редагувати</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
              {([
                [selected.exercises.length, "ВПРАВ"],
                [totalSets(selected), "ПІДХОДІВ"],
                [totalVolume(selected).toLocaleString(), "КГ ОБСЯГ"],
              ] as [string | number, string][]).map(([val, label]) => (
                <div key={label} className="stat-box">
                  <div style={{ fontSize: 20, fontFamily: "'Bebas Neue',sans-serif", color: "#c8ff00" }}>{val}</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
            <div className="section-title">ВПРАВИ</div>
            <div style={{ background: "#13131a", border: "1px solid #1e1e28", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1.2fr 0.6fr 0.6fr 0.9fr", padding: "10px 16px", borderBottom: "1px solid #1e1e28" }}>
                {["ВПРАВА","ГРУПА","П-ДИ","ПОВТ.","ВАГА"].map((h) => (
                  <div key={h} style={{ fontSize: 10, color: "#444", letterSpacing: ".08em", fontFamily: "'Bebas Neue',sans-serif" }}>{h}</div>
                ))}
              </div>
              {selected.exercises.map((e, i) => (
                <div key={e.id} style={{ display: "grid", gridTemplateColumns: "2.5fr 1.2fr 0.6fr 0.6fr 0.9fr", padding: "12px 16px", borderBottom: i < selected.exercises.length - 1 ? "1px solid #1a1a22" : "none", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13 }}>{e.name}</div>
                    {e.note && <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>{e.note}</div>}
                  </div>
                  <div><span className="tag">{e.group}</span></div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: "#c8ff00" }}>{e.sets}</div>
                  <div style={{ fontSize: 13 }}>{e.reps}</div>
                  <div style={{ fontSize: 13 }}>{e.weight > 0 ? `${e.weight}кг` : "—"}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ADD ── */}
        {view === "add" && (
          <div className="fade-in">
            <button className="btn-ghost" onClick={() => goBack()} style={{ marginBottom: 16, fontSize: 13 }}>← Назад</button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <div className="section-title">НАЗВА</div>
                <input placeholder="Наприклад: Спина + плечі" value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <div className="section-title">ДАТА</div>
                <input type="date" value={form.date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, date: e.target.value }))} />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div className="section-title">НАСТРІЙ</div>
              <div style={{ display: "flex", gap: 8 }}>
                {MOODS.map((m) => (
                  <button key={m} className={`mood-btn ${form.mood === m ? "selected" : ""}`} onClick={() => setForm((f) => ({ ...f, mood: m }))}>{m}</button>
                ))}
              </div>
            </div>
            <div className="section-title">ВПРАВИ</div>
            <ExerciseFormRows exercises={form.exercises} onUpdate={updateExRow} onRemove={removeExRow} onAdd={addExRow} />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" onClick={saveNew} style={{ flex: 1, padding: "12px" }}>Зберегти</button>
              <button className="btn-ghost" onClick={() => setView("log")}>Скасувати</button>
            </div>
          </div>
        )}

        {/* ── EDIT ── */}
        {view === "edit" && editingWorkout && (
          <div className="fade-in">
            <button className="btn-ghost" onClick={() => goBack()} style={{ marginBottom: 16, fontSize: 13 }}>← Назад</button>
            <div style={{ fontSize: 13, color: "#c8ff00", fontFamily: "'Bebas Neue',sans-serif", letterSpacing: ".1em", marginBottom: 20 }}>РЕДАГУВАННЯ ТРЕНУВАННЯ</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <div className="section-title">НАЗВА</div>
                <input value={editingWorkout.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingWorkout((w) => w ? { ...w, name: e.target.value } : w)} />
              </div>
              <div>
                <div className="section-title">ДАТА</div>
                <input type="date" value={editingWorkout.date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingWorkout((w) => w ? { ...w, date: e.target.value } : w)} />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div className="section-title">НАСТРІЙ</div>
              <div style={{ display: "flex", gap: 8 }}>
                {MOODS.map((m) => (
                  <button key={m} className={`mood-btn ${editingWorkout.mood === m ? "selected" : ""}`} onClick={() => setEditingWorkout((w) => w ? { ...w, mood: m } : w)}>{m}</button>
                ))}
              </div>
            </div>
            <div className="section-title">ВПРАВИ</div>
            <ExerciseFormRows exercises={editingWorkout.exercises} onUpdate={updateEditExRow} onRemove={removeEditExRow} onAdd={addEditExRow} />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" onClick={saveEdit} style={{ flex: 1, padding: "12px" }}>Зберегти зміни</button>
              <button className="btn-ghost" onClick={() => setView("log")}>Скасувати</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
