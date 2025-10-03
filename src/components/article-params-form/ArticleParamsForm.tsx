import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';

import styles from './ArticleParamsForm.module.scss';
import { useEffect, useRef, useState } from 'react';
import { ArticleStateType, backgroundColors, contentWidthArr, defaultArticleState, fontColors, fontFamilyOptions, fontSizeOptions, OptionType } from 'src/constants/articleProps';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';

type ArticleFormParams = {
	articleParams: ArticleStateType;
	setArticleParams: (params: ArticleStateType) => void;
}

export const ArticleParamsForm = (props: ArticleFormParams) => {
	const { articleParams, setArticleParams } = props;

	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	const [currentParams, setCurrentParams] = useState<ArticleStateType>(articleParams);

	const submitStyles = () => setArticleParams(currentParams);

	const resetStyles = () => {
		setArticleParams(defaultArticleState);
		setCurrentParams(defaultArticleState);
	}

	const setStyle = <K extends keyof ArticleStateType>(key: K, value: OptionType): void => (setCurrentParams({
		...currentParams,
		[key]: value as ArticleStateType[K]
	}));

	  // --- NEW: refs для сайдбара и обёртки кнопки
  const asideRef = useRef<HTMLDivElement>(null);
  const arrowWrapRef = useRef<HTMLDivElement>(null);

  // --- NEW: закрытие по клику вне и по Escape
  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;

      // клик внутри сайдбара — игнор
      if (asideRef.current?.contains(target)) return;
      // клик по стрелке/внутри её обёртки — игнор
      if (arrowWrapRef.current?.contains(target)) return;

      setIsMenuOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

	return (
		<>
			<div ref={arrowWrapRef}>
        <ArrowButton isOpen={isMenuOpen} onClick={toggleMenu} />
      </div>
			<aside ref={asideRef} className={`${styles.container} ${isMenuOpen ? styles.container_open : ''}`} aria-hidden={!isMenuOpen}>
				<form className={styles.form} onSubmit={(e) => { e.preventDefault(); submitStyles(); }} onReset={() => resetStyles()}>
					<Text weight={800} size={31} uppercase={true}>Задайте параметры</Text>
					<Select options={fontFamilyOptions} selected={currentParams.fontFamilyOption} title={"Шрифт"} onChange={(v) => setStyle('fontFamilyOption', v)} />
					<RadioGroup options={fontSizeOptions} title={"Размер шрифта"} selected={currentParams.fontSizeOption} name={"font-size"} onChange={(v) => setStyle('fontSizeOption', v)} />
					<Select options={fontColors} selected={currentParams.fontColor} title={"Цвет шрифта"} onChange={(v) => setStyle('fontColor', v)} />
					<Separator />
					<Select options={backgroundColors} selected={currentParams.backgroundColor} title={"Цвет фона"} onChange={(v) => setStyle('backgroundColor', v)} />
					<Select options={contentWidthArr} selected={currentParams.contentWidth} title={"Ширина контента"} onChange={(v) => setStyle('contentWidth', v)} />

					<div className={styles.bottomContainer}>
						<Button title='Сбросить'  htmlType='reset'  type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
