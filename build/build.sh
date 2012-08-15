#!/bin/sh

root_dir="`pwd`"
src_dir="$root_dir/src"

build_dir="$root_dir/build"
dist_dir="$root_dir/dist"

src_file="$src_dir/Cookie.js"

output_file="$dist_dir/Cookie.js"
output_file_compressed="$dist_dir/Cookie.min.js"

version_txt_file="$build_dir/version.txt"
header_file="$build_dir/header.txt"

check_mark="\033[32m✔\033[39m"



#
# Clean up previous builds
#

echo
echo "------------"
echo "| ClEANING |"
echo "------------"
echo

echo "---> Removing dist folder."
echo

rm -rf $dist_dir
mkdir -p $dist_dir

echo "$check_mark Done!"



#
# Figure out which versions we're dealing with
#

echo
echo "-----------"
echo "| VERSION |"
echo "-----------"
echo

echo "---> Calculate and increment version."
echo

version_current=`cat $version_txt_file`
version_major_minor=${version_current%.*}
version_point=${version_current##*.}
version_new="${version_major_minor}.$(($version_point + 1))" # increment by 1
version_new_datetime=$(date +"%a %b %d %T %Y %z")

echo "Current version...: $version_current"
echo "New version.......: $version_new"
echo "Date..............: $version_new_datetime"

echo 
echo "$check_mark Done!"



#
# Update version
#

echo
echo "------------------"
echo "| UPDATE VERSION |"
echo "------------------"
echo

echo "---> Updated to version $version_new"
echo $version_new > $version_txt_file
echo
echo "$check_mark Done!"



#
# Update header file and combine source files. 
#

echo
echo "-----------------"
echo "| BUILDING DIST |"
echo "-----------------"
echo

echo "---> Insert current version and date tokens in header."
sed -e "s/\${release\.version}/$version_new/" -e "s/\${release\.date}/$version_new_datetime/" -e "s/\${release\.year}/`date +"%Y"`/"  $header_file >$header_file.tmp

echo "---> Adding header to output file."
cat $header_file.tmp "$src_file" > "$output_file"

echo "---> Minify with UglifyJS."
# note: the uglifyjs "uglifyjs -nc" option removes comments.
SIZE_MIN=$(uglifyjs "$output_file" --extra --unsafe | tee "$output_file_compressed" | wc -c)
SIZE_GZIP=$(gzip -nfc --best "$output_file_compressed" | wc -c)

echo "---> $SIZE_MIN bytes minified, $SIZE_GZIP bytes when gzipped."

echo 
echo "$check_mark Done!"



echo
echo "----------------"
echo "| POST COMPILE |"
echo "----------------"
echo

echo "---> Seperate code from comments with a line-break in minified release."
node build/post-compile.js dist/Cookie.min.js > dist/Cookie.min.tmp.js
rm -f dist/Cookie.min.js
mv dist/Cookie.min.tmp.js dist/Cookie.min.js

echo "---> Removing temporary header file."
rm -f $header_file.tmp

echo
echo "$check_mark Done!"



echo
echo "------------------"
echo "| BUILD COMPLETE |"
echo "------------------"
echo

echo "Compiled local files: "
echo
echo " - $output_file"
echo " - $output_file_compressed"
echo
echo "$check_mark All done!"
echo