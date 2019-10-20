import pandas as pd
import Back.config as cf


dt = pd.read_csv(cf.base_dir + cf.raw_data, sep=';', encoding="ISO-8859-1")
print(dt.loc[:2])