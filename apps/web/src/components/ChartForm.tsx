import { useState, type FormEvent } from 'react';
import { CITIES, PRESETS, type BirthInput, type Gender } from '@ziwei/core';

interface Props {
  preset: string;
  onPresetChange: (preset: string) => void;
  onSubmit: (input: BirthInput) => void;
}

export function ChartForm({ preset, onPresetChange, onSubmit }: Props) {
  const [date, setDate] = useState('1990-01-15');
  const [time, setTime] = useState('08:30');
  const [gender, setGender] = useState<Gender>('male');
  const [city, setCity] = useState('北京');
  const [useTst, setUseTst] = useState(true);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = time.split(':').map(Number);
    if (!y || !m || !d || hh === undefined) return;
    onSubmit({
      year: y,
      month: m,
      day: d,
      hour: hh,
      minute: mm ?? 0,
      gender,
      city: useTst && city ? city : undefined,
      useTrueSolarTime: useTst && !!city,
    });
  };

  return (
    <form className="panel chart-form" onSubmit={handleSubmit}>
      <h2>出生信息</h2>
      <label>
        公历日期
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <label>
        出生时间
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </label>
      <div className="row">
        <label>
          性别
          <select value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </label>
        <label>
          流派
          <select value={preset} onChange={(e) => onPresetChange(e.target.value)}>
            {Object.keys(PRESETS).map((key) => (
              <option key={key} value={key}>
                {key === 'wenmo-zhongzhou' ? '中州派(文墨对齐)' : '全书通行版'}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        出生城市(真太阳时)
        <input list="cities" value={city} onChange={(e) => setCity(e.target.value)} placeholder="离线库查询经度" />
        <datalist id="cities">
          {CITIES.map((c) => (
            <option key={c.pinyin} value={c.name} />
          ))}
        </datalist>
      </label>
      <label className="checkbox">
        <input type="checkbox" checked={useTst} onChange={(e) => setUseTst(e.target.checked)} />
        按真太阳时校正时辰
      </label>
      <button type="submit" className="primary">
        排盘
      </button>
    </form>
  );
}
